import React from 'react';
import { Box, Button, ButtonGroup, Tooltip, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface WorkoutPlanActionsProps {
  onSave?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onAddToCalendar?: () => void;
  variant?: 'buttons' | 'icons';
  size?: 'small' | 'medium' | 'large';
}

const WorkoutPlanActions: React.FC<WorkoutPlanActionsProps> = ({ 
  onSave, 
  onPrint, 
  onShare, 
  onDownload,
  onAddToCalendar,
  variant = 'buttons',
  size = 'medium'
}) => {
  if (variant === 'icons') {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {onSave && (
          <Tooltip title="Save workout">
            <IconButton onClick={onSave} size={size} color="primary">
              <SaveIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {onPrint && (
          <Tooltip title="Print workout">
            <IconButton onClick={onPrint} size={size} color="primary">
              <PrintIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {onShare && (
          <Tooltip title="Share workout">
            <IconButton onClick={onShare} size={size} color="primary">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {onDownload && (
          <Tooltip title="Download workout">
            <IconButton onClick={onDownload} size={size} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {onAddToCalendar && (
          <Tooltip title="Add to calendar">
            <IconButton onClick={onAddToCalendar} size={size} color="primary">
              <CalendarTodayIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <ButtonGroup variant="outlined" size={size}>
      {onSave && (
        <Button startIcon={<SaveIcon />} onClick={onSave}>
          Save
        </Button>
      )}
      
      {onPrint && (
        <Button startIcon={<PrintIcon />} onClick={onPrint}>
          Print
        </Button>
      )}
      
      {onShare && (
        <Button startIcon={<ShareIcon />} onClick={onShare}>
          Share
        </Button>
      )}
      
      {onDownload && (
        <Button startIcon={<DownloadIcon />} onClick={onDownload}>
          Download
        </Button>
      )}
      
      {onAddToCalendar && (
        <Button startIcon={<CalendarTodayIcon />} onClick={onAddToCalendar}>
          Calendar
        </Button>
      )}
    </ButtonGroup>
  );
};

export default WorkoutPlanActions;
