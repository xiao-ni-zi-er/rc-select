import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import Input from './Input';
import type { InnerSelectorProps } from '.';
import { getTitle } from '../utils/commonUtil';

interface SelectorProps extends InnerSelectorProps {
  inputElement: React.ReactElement;
  activeValue: string;
}

const SingleSelector: React.FC<SelectorProps> = (props) => {
  const {
    inputElement,
    prefixCls,
    id,
    fieldid= props.fieldid ? props.fieldid + '_search_input' : '',
    inputRef,
    disabled,
    autoFocus,
    autoComplete,
    activeDescendantId,
    mode,
    open,
    values,
    placeholder,
    tabIndex,

    showSearch,
    searchValue,
    activeValue,
    maxLength,

    onInputKeyDown,
    onInputMouseDown,
    onInputChange,
    onInputPaste,
    onInputCompositionStart,
    onInputCompositionEnd,
  } = props;

  const [inputChanged, setInputChanged] = React.useState(false);

  const combobox = mode === 'combobox';
  const inputEditable = combobox || showSearch || !mode;
  // combobox和showSearch模式下input框可输入，其他模式均为readonly
  const inputReadOnly = !(combobox || showSearch)
  const item = values[0];

  let inputValue: string = searchValue || '';
  if (combobox && activeValue && !inputChanged) {
    inputValue = activeValue;
  }
  // 支持默认非检索模式下input框value有值（只兼容label是非节点内容）string | number | bool | 文本数组['text1', 'text2]
  if (!mode && item && item.label && !showSearch) { // string | number | bool | ReactElement
    if (typeof item.label !== 'object') { // string | number | bool
      inputValue = item.label.toString();
    }
    if (typeof item.label === 'object' && !React.isValidElement(item.label)
    && Array.isArray(item.label) && !item.label.find(el => React.isValidElement(el))) { // 文本数组['text1', 'text2]
      item.label.forEach(el => {
        inputValue = inputValue + el.toString();
      })
    }
  }

  React.useEffect(() => {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]);

  // Not show text when closed expect combobox mode | mode is undefind
  const hasTextInput = !!mode && mode !== 'combobox' && !open && !showSearch ? false : !!inputValue;

  // Get title
  const title = getTitle(item);

  const renderPlaceholder = () => {
    if (item) {
      return null;
    }
    const hiddenStyle = hasTextInput ? { visibility: 'hidden' as const } : undefined;
    return (
      <span className={`${prefixCls}-selection-placeholder`} style={hiddenStyle}>
        {placeholder}
      </span>
    );
  };

  return (
    <>
      <span className={`${prefixCls}-selection-search`}>
        <Input
          ref={inputRef}
          prefixCls={prefixCls}
          id={id}
          fieldid={fieldid}
          open={open}
          inputElement={inputElement}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          editable={inputEditable}
          readOnly={inputReadOnly}
          activeDescendantId={activeDescendantId}
          value={inputValue}
          onKeyDown={onInputKeyDown}
          onMouseDown={onInputMouseDown}
          onChange={(e) => {
            setInputChanged(true);
            onInputChange(e as any);
          }}
          onPaste={onInputPaste}
          onCompositionStart={onInputCompositionStart}
          onCompositionEnd={onInputCompositionEnd}
          tabIndex={tabIndex}
          attrs={pickAttrs(props, true)}
          maxLength={combobox ? maxLength : undefined}
        />
      </span>

      {/* Display value */}
      {!combobox && item && !hasTextInput && (
        <span className={`${prefixCls}-selection-item`} title={title}>
          {item.label}
        </span>
      )}

      {/* Display placeholder */}
      {renderPlaceholder()}
    </>
  );
};

export default SingleSelector;
