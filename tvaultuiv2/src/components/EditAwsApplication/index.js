import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { InputLabel, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';
import ButtonComponent from '../FormFields/ActionButton';
import TextFieldComponent from '../FormFields/TextField';
import RadioSafePermissionComponent from '../../views/private/safe/components/RadioPermissions';
import RadioSvcPermissionComponent from '../../views/private/service-accounts/components/RadioPermissions';
import ComponentError from '../../errorBoundaries/ComponentError/component-error';
import mediaBreakpoints from '../../breakpoints';

const { small } = mediaBreakpoints;

const InputWrapper = styled.div`
  margin-top: 4rem;
  margin-bottom: 2.4rem;
  position: relative;
  .MuiInputLabel-root {
    display: flex;
    align-items: center;
  }
`;

const PermissionWrapper = styled.div`
  padding: 1rem 4rem 4rem 4rem;
  background-color: #1f232e;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  ${small} {
    padding: 2.2rem 2.4rem 2.4rem 2.4rem;
  }
`;
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
  }
  .MuiTypography-h5 {
    font-weight: normal;
    ${small} {
      font-size: 1.6rem;
    }
  }
`;

const RadioButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${small} {
    flex-direction: column;
  }
  fieldset {
    ${small} {
      margin-bottom: 4.5rem;
    }
  }
`;
const CancelSaveWrapper = styled.div`
  display: flex;
`;

const CancelButton = styled.div`
  margin-right: 0.8rem;
  ${small} {
    width: 100%;
  }
`;

const EditAwsApplication = (props) => {
  const {
    handleCancelClick,
    handleSaveClick,
    awsName,
    access,
    isSvcAccount,
  } = props;
  const [radioValue, setRadioValue] = useState('read');
  const [value, setValue] = useState('');
  const [disabledSave, setDisabledSave] = useState(true);
  const isMobileScreen = useMediaQuery(small);

  useEffect(() => {
    setValue(awsName);
    setRadioValue(access);
  }, [awsName, access]);

  useEffect(() => {
    if (radioValue === access) {
      setDisabledSave(true);
    } else {
      setDisabledSave(false);
    }
  }, [radioValue, access]);

  return (
    <ComponentError>
      <PermissionWrapper>
        <HeaderWrapper>
          <Typography variant="h5">AWS Configuration</Typography>
        </HeaderWrapper>
        <InputWrapper>
          <InputLabel>Aws Application Name</InputLabel>
          <TextFieldComponent
            value={value}
            placeholder="AWS Application Name"
            fullWidth
            readOnly
            name="name"
          />
        </InputWrapper>
        <RadioButtonWrapper>
          {isSvcAccount ? (
            <RadioSvcPermissionComponent
              radioValue={radioValue}
              isEdit={!!(access && awsName)}
              handleRadioChange={(e) => setRadioValue(e.target.value)}
            />
          ) : (
            <RadioSafePermissionComponent
              radioValue={radioValue}
              handleRadioChange={(e) => setRadioValue(e.target.value)}
            />
          )}
          <CancelSaveWrapper>
            <CancelButton>
              <ButtonComponent
                label="Cancel"
                color="primary"
                onClick={handleCancelClick}
                width={isMobileScreen ? '100%' : ''}
              />
            </CancelButton>
            <ButtonComponent
              label={awsName && access ? 'Edit' : 'Save'}
              color="secondary"
              onClick={() => handleSaveClick(value, radioValue)}
              disabled={disabledSave}
              width={isMobileScreen ? '100%' : ''}
            />
          </CancelSaveWrapper>
        </RadioButtonWrapper>
      </PermissionWrapper>
    </ComponentError>
  );
};

EditAwsApplication.propTypes = {
  handleSaveClick: PropTypes.func.isRequired,
  handleCancelClick: PropTypes.func.isRequired,
  access: PropTypes.string.isRequired,
  awsName: PropTypes.string.isRequired,
  isSvcAccount: PropTypes.bool,
};

EditAwsApplication.defaultProps = {
  isSvcAccount: false,
};

export default EditAwsApplication;