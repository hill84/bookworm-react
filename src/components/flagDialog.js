import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useState } from 'react';
import { boolType, funcType, objectType, stringType } from '../config/types';

const FlagDialog = ({
  loading,
  onClose,
  onFlag: _onFlag,
  open,
  TransitionComponent,
  value: _value
}) => {
  const [value, setValue] = useState(_value);
  
  const onChange = e => setValue(e.target.value);
  const onFlag = () => _onFlag(value);

  return (
    <Dialog
      open={open}
      TransitionComponent={TransitionComponent}
      keepMounted
      onClose={onClose}
      aria-labelledby="flag-dialog-title">
      {loading && <div aria-hidden="true" className="loader"><CircularProgress /></div>}
      <DialogTitle id="flag-dialog-title">
        Segnala commento
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="flag"
            name="flag"
            value={value}
            onChange={onChange}>
            <FormControlLabel value="spam" control={<Radio />} label="Contenuti commerciali indesiderati o spam" />
            <FormControlLabel value="porn" control={<Radio />} label="Pornografia o materiale sessualmente esplicito" />
            <FormControlLabel value="hate" control={<Radio />} label="Incitamento all'odio o violenza esplicita" />
            <FormControlLabel value="bully" control={<Radio />} label="Molestie o bullismo" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions className="dialog-footer flex no-gutter">
        <button type="button" className="btn btn-footer flat" onClick={onClose}>Annulla</button>
        {value && <button type="button" className="btn btn-footer primary" onClick={onFlag}>Segnala</button>}
      </DialogActions>
    </Dialog>
  );
}

FlagDialog.propTypes = {
  loading: boolType,
  onClose: funcType.isRequired,
  onFlag: funcType.isRequired,
  open: boolType.isRequired,
  TransitionComponent: objectType,
  value: stringType
}

FlagDialog.defaultProps = {
  loading: false,
  TransitionComponent: null,
  value: ''
}

export default FlagDialog;