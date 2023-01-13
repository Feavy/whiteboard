import './Toolbar.css'
import { fabric } from 'fabric';
import {useEffect, useRef} from "react";
import RectangleIcon from '@mui/icons-material/RectangleOutlined';
import CircleIcon from '@mui/icons-material/CircleOutlined';
import TriangleIcon from '@mui/icons-material/ChangeHistoryOutlined';

function Toolbar() {
  return (
      <div id="toolbar">
        <div className="button"><RectangleIcon/></div>
        <div className="button"><CircleIcon/></div>
        <div className="button"><TriangleIcon/></div>
      </div>
  )
}

export default Toolbar;
