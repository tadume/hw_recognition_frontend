/** @jsxRuntime classic */
/** @jsx jsx */

import React, { FC, memo } from "react";
import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Flex, Heading } from "@chakra-ui/react";

const HandWritten: FC = memo(() => {
  const StyledCanvas = styled.canvas`
    width: 28px;
    height: 28px;
    border: 1px solid black;
    margin: 6px 0;
  `;
  return (
    <Flex direction="column" alignItems="center">
      <Heading as="h1" mb={5}>
        Hand Written Recognition
      </Heading>
      <StyledCanvas />
      <Flex direction="row">
        <Button mr={5} colorScheme="teal" variant="outline">
          reset
        </Button>
        <Button colorScheme="teal" variant="solid">
          predict
        </Button>
      </Flex>
    </Flex>
  );
});

export default HandWritten;
