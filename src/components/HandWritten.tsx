/** @jsxRuntime classic */
/** @jsx jsx */

import React, { FC, memo, useRef, useState } from 'react';
import { jsx, css } from '@emotion/react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const HandWritten: FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [predictedLabel, setPredictedLabel] = useState<String>('');
  const [predictionProb, setPredictionProb] = useState<Array<number>>([]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  );

  const canvasSize = {
    width: 28,
    height: 28,
  };

  const data = {
    labels: Array.from({ length: 10 }, (_, index) => index.toString()),
    datasets: [
      {
        label: 'prediction',
        data: predictionProb,
      },
    ],
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

  const handleReset = () => {
    clearDrawing();
    setPredictedLabel('');
    setPredictionProb([]);
  };

  const predict = async () => {
    const base64String = canvasRef.current?.toDataURL('image/png');
    const res = await axios
      .post('http://localhost:8000/api/predict', {
        image: base64String,
      })
      .then((res) => {
        setPredictedLabel(res.data.predicted_label);
        setPredictionProb(res.data.prediction_prob);
      })
      .catch((e) => {
        console.log(e);
        alert('an error occured while predicting');
      });
  };

  return (
    <Flex direction="column" alignItems="center">
      <Heading as="h1" mb={5}>
        Hand Written Recognition
      </Heading>
      <canvas
        css={css`
          border: 1px solid black;
          margin: 10px 0;
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
          onClick={handleReset}
        >
          reset
        </Button>
        <Button colorScheme="teal" variant="solid" onClick={predict}>
          predict
        </Button>
      </Flex>
      <Heading as="h2" fontSize="lg" mt={5}>
        {predictedLabel && `predicted : ${predictedLabel}`}
      </Heading>
      {predictionProb.length !== 0 && (
        <div
          css={css`
            width: 50%;
          `}
        >
          <Bar data={data} />
        </div>
      )}
    </Flex>
  );
});

export default HandWritten;
