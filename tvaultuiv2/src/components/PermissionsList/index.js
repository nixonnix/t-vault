import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import userIcon from '../../assets/permission-user.png';
import EditDeletePopper from '../../views/private/safe/components/EditDeletePopper';
import {
  TitleTwo,
  TitleFour,
  BackgroundColor,
} from '../../styles/GlobalStyles';

const UserList = styled.div`
  margin-top: 2rem;
  > div:not(:last-child) {
    border-bottom: 1px solid #323649;
  }
`;

const Wrap = styled.div``;

const EachUserWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${BackgroundColor.listBg};
  padding: 1.2rem 0;
  :hover {
    background-image: ${(props) => props.theme.gradients.list || 'none'};
  }
`;

const IconDetailsWrap = styled.div`
  display: flex;
`;

const Icon = styled.img`
  width: 5rem;
  height: 5rem;
  margin-right: 1.6rem;
  margin-left: 2rem;
`;

const Details = styled.div``;

const styles = css`
  margin-bottom: 0.5rem;
`;
const permissionStyles = css`
  opacity: 0.7;
`;

const PermissionsList = (props) => {
  const { onEditClick, list, onDeleteClick, isSvcAccount, username } = props;
  return (
    <UserList>
      {Object.entries(list).map(([key, value]) => (
        <Wrap key={key}>
          {username !== key && value !== 'write' && (
            <EachUserWrap>
              <IconDetailsWrap>
                <Icon src={userIcon} alt="user" />
                <Details>
                  <TitleTwo extraCss={styles}>{key}</TitleTwo>
                  <TitleFour extraCss={permissionStyles}>
                    {isSvcAccount && value === 'write' ? 'reset' : value}
                  </TitleFour>
                </Details>
              </IconDetailsWrap>
              <EditDeletePopper
                onEditClicked={() => onEditClick(key, value)}
                onDeleteClicked={() => onDeleteClick(key, value)}
              />
            </EachUserWrap>
          )}
        </Wrap>
      ))}
    </UserList>
  );
};
PermissionsList.propTypes = {
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  list: PropTypes.objectOf(PropTypes.any).isRequired,
  isSvcAccount: PropTypes.bool,
  username: PropTypes.string,
};

PermissionsList.defaultProps = {
  isSvcAccount: false,
  username: '',
};

export default PermissionsList;
