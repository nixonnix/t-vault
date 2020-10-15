import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import { Backdrop, Typography, InputLabel } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import styled, { css } from 'styled-components';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextFieldComponent from '../../../../components/FormFields/TextField';
import ButtonComponent from '../../../../components/FormFields/ActionButton';
import SelectComponent from '../../../../components/FormFields/SelectFields';
import ComponentError from '../../../../errorBoundaries/ComponentError/component-error';
import safeIcon from '../../../../assets/icon_safe.svg';
import leftArrowIcon from '../../../../assets/left-arrow.svg';
import mediaBreakpoints from '../../../../breakpoints';
import SnackbarComponent from '../../../../components/Snackbar';
import AutoCompleteComponent from '../../../../components/FormFields/AutoComplete';
import LoaderSpinner from '../../../../components/Loaders/LoaderSpinner';
import { validateEmail } from '../../../../services/helper-function';
import apiService from '../apiService';
import { TitleThree } from '../../../../styles/GlobalStyles';

const { small, belowLarge } = mediaBreakpoints;

const ModalWrapper = styled.section`
  background-color: ${(props) => props.theme.palette.background.modal};
  padding: 5.5rem 6rem 6rem 6rem;
  border: none;
  outline: none;
  width: 69.6rem;
  margin: auto 0;
  display: flex;
  flex-direction: column;
  position: relative;
  ${belowLarge} {
    padding: 2.7rem 5rem 3.2rem 5rem;
    width: 57.2rem;
  }
  ${small} {
    width: 100%;
    padding: 2rem;
    margin: 0;
    height: fit-content;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  ${small} {
    margin-top: 1rem;
  }
`;

const LeftIcon = styled.img`
  display: none;
  ${small} {
    display: block;
    margin-right: 1.4rem;
    margin-top: 0.3rem;
  }
`;
const IconDescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  margin-top: 3.2rem;
`;

const SafeIcon = styled.img`
  height: 5.7rem;
  width: 5rem;
  margin-right: 2rem;
`;

const extraCss = css`
  ${small} {
    font-size: 1.3rem;
  }
`;

const CreateSafeForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 2.8rem;
`;

const InputFieldLabelWrapper = styled.div`
  margin-bottom: 2rem;
  position: ${(props) => (props.postion ? 'relative' : '')};
  .MuiSelect-icon {
    top: auto;
    color: #000;
  }
`;

const FieldInstruction = styled.p`
  color: #8b8ea6;
  font-size: 1.3rem;
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
`;

const CancelSaveWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  ${small} {
    margin-top: 5.3rem;
  }
  button {
    ${small} {
      height: 4.5rem;
    }
  }
`;

const CancelButton = styled.div`
  margin-right: 0.8rem;
  ${small} {
    margin-right: 1rem;
    width: 100%;
  }
`;

const loaderStyle = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: red;
  z-index: 1;
`;

const autoLoaderStyle = css`
  position: absolute;
  top: 3rem;
  right: 1rem;
  color: red;
`;

const useStyles = makeStyles((theme) => ({
  select: {
    '&.MuiFilledInput-root.Mui-focused': {
      backgroundColor: '#fff',
    },
  },
  dropdownStyle: {
    backgroundColor: '#fff',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
    padding: '10rem 0',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'unset',
      justifyContent: 'unset',
      padding: '0',
      height: '100%',
    },
  },
}));

const CreateModal = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [safeType, setSafeType] = useState('Users Safe');
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [disabledSave, setDisabledSave] = useState(true);
  const [responseType, setResponseType] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [autoLoader, setAutoLoader] = useState(false);
  const [options, setOptions] = useState([]);
  const isMobileScreen = useMediaQuery(small);
  const [helperText] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [safeError, setSafeError] = useState(false);
  const [editSafe, setEditSafe] = useState(false);
  const [safeDetails, setSafeDetails] = useState({});
  const [isValidEmail, setIsValidEmail] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (owner?.length > 2) {
      if (!autoLoader) {
        if (options.length === 0 || !options.includes(owner)) {
          setIsValidEmail(false);
        } else {
          setIsValidEmail(true);
        }
      }
    }
  }, [owner, autoLoader, options]);

  useEffect(() => {
    if (
      name === '' ||
      owner === '' ||
      description.length < 10 ||
      safeError ||
      emailError ||
      !isValidEmail ||
      (safeDetails.owner === owner && safeDetails.description === description)
    ) {
      setDisabledSave(true);
    } else {
      setDisabledSave(false);
    }
  }, [
    name,
    description,
    owner,
    safeError,
    emailError,
    editSafe,
    safeDetails,
    isValidEmail,
  ]);

  const [menu] = useState(['Users Safe', 'Shared Safe', 'Application Safe']);

  const handleClose = () => {
    setOpen(false);
    history.goBack();
  };

  useEffect(() => {
    if (
      history.location.pathname === '/safe/edit-safe' &&
      history.location.state
    ) {
      setEditSafe(true);
      setResponseType(0);
      apiService
        .getSafeDetails(history.location.state.safe.path)
        .then((res) => {
          setResponseType(null);
          if (res?.data?.data) {
            setSafeDetails(res.data.data);
            setName(res.data.data.name);
            setDescription(res.data.data.description);
            setOwner(res.data.data.owner);
            if (res.data.data.type === 'users') {
              setSafeType('Users Safe');
            } else if (res.data.data.type === 'apps') {
              setSafeType('Application Safe');
            } else {
              setSafeType('Shared Safe');
            }
          }
        })
        .catch((err) => {
          if (err.response && err.response.data?.errors[0]) {
            setToastMessage(err.response.data.errors[0]);
          }
          setResponseType(-1);
        });
    }
  }, [history]);

  const constructPayload = () => {
    let value = safeType.split(' ')[0].toLowerCase();
    if (value === 'application') {
      value = 'apps';
    }
    const data = {
      data: {
        name,
        description,
        type: '',
        owner,
      },
      path: `${value}/${name}`,
    };
    return data;
  };

  const onEditSafes = () => {
    const payload = constructPayload();
    setResponseType(0);
    apiService
      .editSafe(payload)
      .then((res) => {
        if (res && res.status === 200) {
          setResponseType(1);
          setToastMessage(`Safe ${name} updated successfully!`);
          setTimeout(() => {
            setOpen(false);
            history.goBack();
          }, 1000);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data?.errors[0]) {
          setToastMessage(err.response.data.errors[0]);
        }
        setResponseType(-1);
      });
  };

  const onCreateSafes = () => {
    const payload = constructPayload();
    setDisabledSave(true);
    setResponseType(0);
    apiService
      .createSafe(payload)
      .then((res) => {
        if (res && res.status === 200) {
          setResponseType(1);
          setTimeout(() => {
            setOpen(false);
            history.goBack();
          }, 1000);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data?.errors[0]) {
          setToastMessage(err.response.data.errors[0]);
        }
        setResponseType(-1);
      });
  };

  const callSearchApi = useCallback(
    debounce(
      (value) => {
        setAutoLoader(true);
        apiService
          .getOwnerEmail(value)
          .then((res) => {
            setOptions([]);
            const array = [];
            setAutoLoader(false);
            if (res?.data?.data?.values?.length > 0) {
              res.data.data.values.map((item) => {
                if (item.userEmail) {
                  return array.push(item.userEmail);
                }
                return null;
              });
              setOptions([...array]);
            }
          })
          .catch(() => setAutoLoader(false));
      },
      1000,
      true
    ),
    []
  );
  const onOwnerChange = (e) => {
    setOwner(e.target.value);
    if (e.target.value !== '' && e.target.value.length > 2) {
      callSearchApi(e.target.value);
    }
  };

  const onSelected = (e, val) => {
    setOwner(val);
  };
  const onToastClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setResponseType(null);
  };

  const onInputBlur = (e) => {
    if (e.target.name === 'name') {
      if (name.length < 3) {
        setSafeError(true);
      } else {
        setSafeError(false);
      }
    }
    if (e.target.name === 'owner') {
      if (validateEmail(owner)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
  };

  return (
    <ComponentError>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => handleClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <ModalWrapper>
            {responseType === 0 && <LoaderSpinner customStyle={loaderStyle} />}
            <HeaderWrapper>
              <LeftIcon
                src={leftArrowIcon}
                alt="go-back"
                onClick={() => handleClose()}
              />
              <Typography variant="h5">Create Safe</Typography>
            </HeaderWrapper>
            <IconDescriptionWrapper>
              <SafeIcon src={safeIcon} alt="safe-icon" />
              <TitleThree lineHeight="1.8rem" extraCss={extraCss} color="#ccc">
                A Safe is a logical unit to store the secrets. All the safes are
                created within Vault. You can control access only at the safe
                level. As a vault administrator you can manage safes but cannot
                view the content of the safe.
              </TitleThree>
            </IconDescriptionWrapper>
            <CreateSafeForm>
              <InputFieldLabelWrapper>
                <InputLabel required>Safe Name</InputLabel>
                <TextFieldComponent
                  value={name}
                  placeholder="Save Name"
                  fullWidth
                  readOnly={!!editSafe}
                  name="name"
                  onChange={(e) => {
                    setName(e.target.value);
                    setSafeError(false);
                  }}
                  error={safeError}
                  helperText={
                    safeError ? 'Please enter minimum 3 characters' : ''
                  }
                  onInputBlur={(e) => onInputBlur(e)}
                />
              </InputFieldLabelWrapper>
              <InputFieldLabelWrapper postion>
                <InputLabel required>Owner</InputLabel>
                <AutoCompleteComponent
                  options={options}
                  classes={classes}
                  searchValue={owner}
                  name="owner"
                  onSelected={(e, val) => onSelected(e, val)}
                  onChange={(e) => onOwnerChange(e)}
                  placeholder="Email address- Enter min 3 characters"
                  error={
                    emailError || (!isValidEmail && safeDetails.owner !== owner)
                  }
                  onInputBlur={(e) => onInputBlur(e)}
                  helperText={
                    (!isValidEmail && safeDetails.owner !== owner) || emailError
                      ? 'Please enter a valid email address or not available!'
                      : ''
                  }
                />
                {autoLoader && <LoaderSpinner customStyle={autoLoaderStyle} />}
              </InputFieldLabelWrapper>
              <InputFieldLabelWrapper>
                <InputLabel required>Type of Safe</InputLabel>
                <SelectComponent
                  menu={menu}
                  value={safeType}
                  classes={classes}
                  readOnly={!!editSafe}
                  onChange={(e) => setSafeType(e.target.value)}
                  helperText={helperText}
                />
              </InputFieldLabelWrapper>
              <InputFieldLabelWrapper>
                <InputLabel required>Description</InputLabel>
                <TextFieldComponent
                  multiline
                  value={description}
                  fullWidth
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add some details about this safe"
                />
                <FieldInstruction>
                  Please add a minimum of 10 characters
                </FieldInstruction>
              </InputFieldLabelWrapper>
            </CreateSafeForm>
            <CancelSaveWrapper>
              <CancelButton>
                <ButtonComponent
                  label="Cancel"
                  color="primary"
                  onClick={() => handleClose()}
                  width={isMobileScreen ? '100%' : ''}
                />
              </CancelButton>
              <ButtonComponent
                label={!editSafe ? 'Create' : 'Edit'}
                color="secondary"
                icon={!editSafe ? 'add' : ''}
                disabled={disabledSave}
                onClick={() => (!editSafe ? onCreateSafes() : onEditSafes())}
                width={isMobileScreen ? '100%' : ''}
              />
            </CancelSaveWrapper>
            {responseType === -1 && (
              <SnackbarComponent
                open
                onClose={() => onToastClose()}
                severity="error"
                icon="error"
                message={toastMessage || 'Something went wrong!'}
              />
            )}
            {responseType === 1 && (
              <SnackbarComponent
                open
                onClose={() => onToastClose()}
                message={
                  toastMessage || 'New Safe has been createtd successfully'
                }
              />
            )}
          </ModalWrapper>
        </Fade>
      </Modal>
    </ComponentError>
  );
};

export default CreateModal;
