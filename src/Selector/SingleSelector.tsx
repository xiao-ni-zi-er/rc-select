import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import Input from './Input';
import type { InnerSelectorProps } from '.';
import { getTitle } from '../utils/commonUtil';

interface SelectorProps extends InnerSelectorProps {
  inputElement: React.ReactElement;
  activeValue: string;
  setInputCopyValue?: (item: any, inputValue?: string) => any;
}

const SingleSelector: React.FC<SelectorProps> = (props) => {
  const {
    inputElement,
    prefixCls,
    id,
    fieldid = props.fieldid ? props.fieldid + '_search_input' : '',
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
    setInputCopyValue,
  } = props;

  const [inputChanged, setInputChanged] = React.useState(false);

  const combobox = mode === 'combobox';
  const inputEditable = combobox || showSearch;
  const item = values[0];

  let inputValue: string = searchValue || '';
  if (combobox && activeValue && !inputChanged) {
    inputValue = activeValue;
  }

  React.useEffect(() => {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]);

  // Not show text when closed expect combobox mode
  const hasTextInput = mode !== 'combobox' && !open && !showSearch ? false : !!inputValue;

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

  const copyValue = setInputCopyValue && setInputCopyValue(item, inputValue);
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
          activeDescendantId={activeDescendantId}
          value={inputValue}
          copyValue={copyValue}
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
        <span
          style={{ opacity: !!copyValue ? 0 : null }}
          className={`${prefixCls}-selection-item`}
          title={title}
        >
          {item.label}
        </span>
      )}

      {/* Display placeholder */}
      {renderPlaceholder()}
    </>
  );
};

export default SingleSelector;
