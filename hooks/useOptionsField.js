import { useCallback, useEffect, useState } from 'react';
import useFieldValue from './useFieldValue';
import _ from 'lodash';

const getEmptyItem = (isKeyValue) => isKeyValue ? { key: '', value: '' } : '';

const cleanUp = (options) => {
  const isKeyValue = _.isPlainObject(options[0]);

  return options.filter((option) => {
    return isKeyValue ? option.key && option.value : !!option;
  });
};

export default function useOptionsField(entityId, recordId, fieldId) {
  const [fieldValue, setFieldValue] = useFieldValue(entityId, recordId, fieldId);
  const values = fieldValue || [];

  const [isKeyValue, setIsKeyValue] = useState(true);
  const [isKeyValueDetermined, setIsKeyValueDetermined] = useState(false);
  const [options, setOptions] = useState([...values, getEmptyItem(isKeyValue)]);

  const updateOptions = useCallback((options) => {
    setFieldValue(cleanUp(options));
    setOptions(options);
  }, [setFieldValue, setOptions]);

  useEffect(() => {
    if (!isKeyValueDetermined && fieldValue && fieldValue.length) {
      const keyAndValue = _.isPlainObject(fieldValue[0]);
      setIsKeyValue(keyAndValue);
      setIsKeyValueDetermined(true);
      setOptions([...values, getEmptyItem(keyAndValue)]);
    }
  }, [fieldValue, isKeyValueDetermined]);

  const onChange = useCallback((index, key, value) => {
    const newOptions = [...options];
    newOptions[index] = isKeyValue ? { key, value } : key;

    const length = options.length;
    if (index === length - 1) {
      newOptions.push(getEmptyItem(isKeyValue));
    }

    updateOptions(newOptions);
  }, [options, fieldValue]);

  const onBlur = useCallback((index) => {
    const length = options.length;
    if (index === length - 1) {
      return;
    }

    const item = options[index];

    if ((isKeyValue && !item.key.length && !item.value.length) || !isKeyValue && !item) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      updateOptions(newOptions);
    }
  }, [options, isKeyValue]);

  const onIsKeyValueChange = useCallback((isTurnedOn) => {
    const converted = options.map((option) => {
      return isTurnedOn ? { key: option, value: '' } : option.key;
    });

    updateOptions(converted);
    setIsKeyValue(isTurnedOn);
  }, [options, fieldValue]);

  return { values: options, isKeyValue, onIsKeyValueChange, onChange, onBlur };
}
