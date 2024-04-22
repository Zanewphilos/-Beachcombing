import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useDate } from '../contexts/DateContext';

interface MyDatePickerProps {
  onDateChange: (date: Date) => void;
}


const MyDatePicker: React.FC<MyDatePickerProps> = ({ onDateChange }) => {
  const { currentDate } = useDate();

  // prepare the date for the maxDate prop
  const today = new Date();
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  return (
    <DatePicker
      selected={currentDate}
      onChange={(date: Date | null) => {
        if (date) {
          onDateChange(date); 
        }
      }}
      minDate={today}
      maxDate={dayAfterTomorrow}
      dateFormat="MM/dd/yyyy" 
      wrapperClassName="datePicker"
    />
  );
};

export default MyDatePicker;