import * as React from 'react';
import { cloneElement, Children, FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    isRequired,
    FieldTitle,
    composeSyncValidators,
    InputProps,
} from 'ra-core';
import { useFieldArray } from 'react-final-form-arrays';
import { InputLabel, FormControl } from '@material-ui/core';

import sanitizeInputRestProps from './sanitizeInputRestProps';

/**
 * To edit arrays of data embedded inside a record, <ArrayInput> creates a list of sub-forms.
 *
 *  @example
 *
 *      import { ArrayInput, SimpleFormIterator, DateInput, TextInput } from 'react-admin';
 *
 *      <ArrayInput source="backlinks">
 *          <SimpleFormIterator>
 *              <DateInput source="date" />
 *              <TextInput source="url" />
 *          </SimpleFormIterator>
 *      </ArrayInput>
 *
 * <ArrayInput> allows the edition of embedded arrays, like the backlinks field
 * in the following post record:
 *
 * {
 *   id: 123
 *   backlinks: [
 *         {
 *             date: '2012-08-10T00:00:00.000Z',
 *             url: 'http://example.com/foo/bar.html',
 *         },
 *         {
 *             date: '2012-08-14T00:00:00.000Z',
 *             url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 *         }
 *    ]
 * }
 *
 * <ArrayInput> expects a single child, which must be a *form iterator* component.
 * A form iterator is a component accepting a fields object as passed by
 * react-final-form-arrays's useFieldArray() hook, and defining a layout for
 * an array of fields. For instance, the <SimpleFormIterator> component
 * displays an array of fields in an unordered list (<ul>), one sub-form by
 * list item (<li>). It also provides controls for adding and removing
 * a sub-record (a backlink in this example).
 *
 * @see https://github.com/final-form/react-final-form-arrays
 */
const ArrayInput: FC<ArrayInputProps> = ({
    className,
    defaultValue,
    label,
    children,
    record,
    resource,
    source,
    validate,
    variant,
    margin = 'dense',
    ...rest
}) => {
    const sanitizedValidate = Array.isArray(validate)
        ? composeSyncValidators(validate)
        : validate;

    const fieldProps = useFieldArray(source, {
        initialValue: defaultValue,
        validate: sanitizedValidate,
        ...rest,
    });

    return (
        <FormControl
            fullWidth
            margin="normal"
            className={className}
            {...sanitizeInputRestProps(rest)}
        >
            <InputLabel htmlFor={source} shrink>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired(validate)}
                />
            </InputLabel>
            {cloneElement(Children.only(children), {
                ...fieldProps,
                record,
                resource,
                source,
                variant,
                margin,
            })}
        </FormControl>
    );
};

ArrayInput.propTypes = {
    // @ts-ignore
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.any,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    validate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func),
    ]),
};

ArrayInput.defaultProps = {
    options: {},
    fullWidth: true,
};

export interface ArrayInputProps extends InputProps {
    children: ReactElement;
}
export default ArrayInput;
