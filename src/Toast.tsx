import React, { useEffect, useState } from "react";

import "./Toast.scss";

type Props = {
  content: string;
};

const Toast: React.FC<Props> = ({ content }) => {
  let classNames = "modal-dialog";
  if (content) {
    classNames += " show";
  }
  return <div className={classNames}>{content}</div>;
};

export default Toast;
