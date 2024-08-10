import React, { FC, memo } from "react";
import { Route, Routes } from "react-router-dom";
import HandWritten from "../components/HandWritten";

const Router: FC = memo(() => {
  return (
    <Routes>
      <Route path="/" element={<HandWritten />} />
    </Routes>
  );
});

export default Router;
