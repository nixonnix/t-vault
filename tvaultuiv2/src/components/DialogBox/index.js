/* eslint-disable import/no-unresolved */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CardMedia from '@material-ui/core/CardMedia';
import ReactHtmlParser from 'react-html-parser';
import ComponentError from 'errorBoundaries/ComponentError/component-error';
import errorIcon from '../../assets/no-permissions.svg';

const DialogeBoxWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: ${(props) => props.width};
`;
const BoxDescription = styled.p`
  text-align: center;
  font-size: 1.4rem;
  color: #5e627c;
`;
const ActionButtonWrap = styled('div')`
  display: flexl;
  justify-content: center;
  position: relative;
  align-items: center;
  justify-content: center;
`;
const bgIconStyle = {
  width: '16rem',
  height: '16rem',
};

const BackgroundIcon = styled(CardMedia)`
  ${(props) => props.imgStyles}
`;
const DialogBox = (props) => {
  const { description, actionButton, width } = props;

  return (
    <ComponentError>
      <DialogeBoxWrapper width={width}>
        <BackgroundIcon
          image={errorIcon}
          title="response-icon"
          imgStyles={bgIconStyle}
        />
        <BoxDescription>{ReactHtmlParser(description)}</BoxDescription>
        <ActionButtonWrap>{actionButton}</ActionButtonWrap>
      </DialogeBoxWrapper>
    </ComponentError>
  );
};
DialogBox.propTypes = {
  description: PropTypes.string,
  actionButton: PropTypes.node,
  width: PropTypes.string,
};
DialogBox.defaultProps = {
  description: 'Something went wrong. Please try again',
  actionButton: <div />,
  width: '100%',
};
export default DialogBox;
