/** @jsxRuntime classic */
/** @jsx jsx */

import React, { FC, memo, useRef, useState } from 'react';
import { jsx, css } from '@emotion/react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import axios from 'axios';

const HandWritten: FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const canvasSize = {
    width: 28,
    height: 28,
  };

  const startDrawing = (x: number, y: number) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const clearDrawing = () => {
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, canvasSize.width, canvasSize.height);
  };

  const predict = async () => {
    const base64String = canvasRef.current?.toDataURL('image/png');
    const res = await axios
      .post('http://localhost:8000/api/predict', {
        image: base64String,
      })
      .catch((e) => {
        console.log(e);
        alert('an error occured while predicting');
      });

    console.log(res);
  };

  return (
    <Flex direction="column" alignItems="center">
      <Heading as="h1" mb={5}>
        Hand Written Recognition
      </Heading>
      <canvas
        css={css`
          border: 1px solid black;
        `}
        width={canvasSize.width}
        height={canvasSize.height}
        ref={canvasRef}
        onMouseDown={(e: React.MouseEvent) => {
          startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        }}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onMouseMove={(e: React.MouseEvent) =>
          draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
      />
      <Flex direction="row">
        <Button
          mr={5}
          colorScheme="teal"
          variant="outline"
          onClick={clearDrawing}
        >
          reset
        </Button>
        <Button colorScheme="teal" variant="solid" onClick={predict}>
          predict
        </Button>
      </Flex>
    </Flex>
  );
});

export default HandWritten;
