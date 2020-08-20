import React, { useRef, useEffect, useState } from 'react';
import { is_writing } from '../../../redux/modules/canvas';
// import { useSelector } from 'react-redux';
import CreateText from '../Tools/CreateText';

function Layer({
  width,
  height,
  alpha,
  color,
  lineWidth,
  lineCap,
  lineJoin,
  isPainting,
  isFilling,
  isPicking,
  isWriting,
  isDrawingShapes,
  mode,
  shapes,
  onChangeStatusToPainting,
  onChangeStatuesToClicking,
  onChangeStatusTowriting,
  onStackHistory,
  onRemoveRedo,
  onChangeColor,
  textMode,
  onChangeMode,
}) {
  const layerRef = useRef();
  const fillRef = useRef({ color, lineWidth });
  const borderRef = useRef({ color, lineWidth });
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [fillMode, setFillMode] = useState({
    color: fillRef.color,
    lineWidth: fillRef.lineWidth,
  });
  const [borderMode, setborderMode] = useState({
    color: borderRef.color,
    lineWidth: borderRef.lineWidth,
  });

  useEffect(() => {
    if (textMode === 'fill') {
      fillRef.current = {
        color: color,
        lineWidth: lineWidth,
      };
      console.log(fillRef);
      setFillMode((preValue) => ({
        ...preValue,
        color: fillRef.current.color,
      }));
      setFillMode((preValue) => ({
        ...preValue,
        lineWidth: fillRef.current.lineWidth,
      }));
    }

    if (textMode === 'border') {
      borderRef.current = {
        color: color,
        lineWidth: lineWidth,
      };
      setborderMode((preValue) => ({
        ...preValue,
        color: borderRef.current.color,
      }));
      setborderMode((preValue) => ({
        ...preValue,
        lineWidth: borderRef.current.lineWidth,
      }));
    }
  }, [textMode, color, lineWidth]);

  useEffect(() => {
    const layer = layerRef.current;
    const ctx = layer.getContext('2d');
    layer.width = width;
    layer.height = height;
    ctx.fillStyle = 'rgba(255,255,255,0)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
  }, [width, height, color, lineWidth, lineCap, lineJoin]);

  const onRightClick = (e) => {
    e.preventDefault();
  };

  function getMousePosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  const onMouseDown = (e) => {
    if (isWriting) return false;
    if (isDrawingShapes) {
      e.preventDefault();
      shapes.location.start = getMousePosition(layerRef.current, e);
    }
    onChangeStatusToPainting(true);
    onChangeStatuesToClicking(true);
  };

  const onMouseMove = (e) => {
    const layer = layerRef.current;
    const ctx = layer.getContext('2d');
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (!isPainting) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      layer.style.webkitFilter = 'blur(0.4px)';
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const onMouseUp = (e) => {
    const layer = layerRef.current;
    const ctx = layer.getContext('2d');
    const layerImg = new Image();
    const src = layer.toDataURL('image/png');
    layerImg.src = src;
    const canvasImg = new Image();
    const style = e.target.attributes.style.value;
    const xml = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>
          img {
            position: absolute;
            top:0;
            left:0;
            ${style}
          }
          </style>
          <img src="${src}"/>
        </div>
      </foreignObject>
    </svg>`;
    canvasImg.src = 'data:image/svg+xml,' + encodeURIComponent(xml);
    canvasImg.onload = function () {
      onStackHistory(canvasImg);
      onChangeStatusToPainting(false);
      onChangeStatuesToClicking(false);
      onRemoveRedo();
      ctx.clearRect(0, 0, width, height);
    };
  };

  const onHandleLayerClick = (e) => {
    const layer = layerRef.current;
    const ctx = layer.getContext('2d');
    isFilling && ctx.fillRect(0, 0, width, height);
    isWriting && setPosition({ x: e.offsetX, y: e.offsetY });
  };

  // function setCurrentColor2ctx() {
  //   const layer = layerRef.current;
  //   const ctx = layer.getContext('2d');
  //   handleAlphaValue();
  //   ctx.fillStyle = color;
  //   layerCtx.fillStyle = color;
  //   layerCtx.strokeStyle = color;
  // }

  return (
    <>
      <canvas
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: width,
          height: height,
          opacity: alpha,
        }}
        onContextMenu={onRightClick}
        ref={layerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => onChangeStatusToPainting(false)}
        onClick={onHandleLayerClick}
      ></canvas>
      {isWriting && (
        <CreateText
          position={position}
          size={lineWidth}
          fillMode={fillMode}
          borderMode={borderMode}
          isWriting={isWriting}
          alpha={alpha}
          textMode={textMode}
          onChangeStatusTowriting={onChangeStatusTowriting}
          onChangeMode={onChangeMode}
        />
      )}
    </>
  );
}

export default Layer;