import { useDispatch } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { categoriesActions } from '../../store/categories/categoriesSlice.ts';

const actions = {
  ...categoriesActions
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
