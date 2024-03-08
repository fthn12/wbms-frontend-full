import { useSelector, useDispatch } from "react-redux";

import * as transactionRedux from "../slices/transaction/transactionSlice";
import {
  useFindManyTransactionQuery,
  useEDispatchTransactionMdispatchMutation,
} from "../slices/transaction/transactionSliceApi";

import { useWeighbridge } from "./useWeighbridge";

export const useTransaction = () => {
  const dispatch = useDispatch();

  const { setWb } = useWeighbridge();

  const { wbTransaction, openedTransaction } = useSelector(
    (state) => state.transaction
  );

  const setWbTransaction = (values) => {
    dispatch(transactionRedux.setWbTransaction(values));

    setWb({ onProcessing: true });
  };

  const clearWbTransaction = () => {
    dispatch(transactionRedux.clearWbTransaction());

    setWb({ onProcessing: false });
  };

  const setOpenedTransaction = (values) => {
    dispatch(transactionRedux.setOpenedTransaction(values));
  };

  const clearOpenedTransaction = () => {
    dispatch(transactionRedux.clearOpenedTransaction());
  };

  return {
    wbTransaction,
    openedTransaction,
    setWbTransaction,
    clearWbTransaction,
    setOpenedTransaction,
    clearOpenedTransaction,
    useFindManyTransactionQuery,
    useEDispatchTransactionMdispatchMutation,
  };
};
