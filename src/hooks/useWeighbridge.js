import { useDispatch, useSelector } from "react-redux";
import { w3cwebsocket } from "websocket";
import moment from "moment";

import * as wbRedux from "../slices/wb/wbSlice";

import { useConfig } from "./";

let wsClient;

export const useWeighbridge = () => {
  const dispatch = useDispatch();

  const { WBMS } = useConfig();

  const wb = useSelector((state) => state.wb);

  const setWb = (values) => {
    dispatch(wbRedux.setWb(values));
  };

  const initWB = () => {
    if (WBMS && WBMS?.WB_PORT && !wsClient) {
      wsClient = new w3cwebsocket(`ws://localhost:${WBMS?.WB_PORT}/GetWeight`);

      if (WBMS.NODE_ENV === "production") {
        dispatch(
          wbRedux.setWb({
            weight: -1,
            // weight: wb?.weight > 0 ? wb.weight + 10 : 10,
            lastChange: 0,
            isStable: false,
            // isStable: true,
            onProcessing: false,
            canStartScalling: false,
          }),
        );
      } else {
        dispatch(
          wbRedux.setWb({
            // weight: -1,
            weight: wb?.weight > 0 ? wb.weight + 10 : 10,
            lastChange: 0,
            // isStable: false,
            isStable: true,
            onProcessing: false,
            canStartScalling: false,
          }),
        );
      }

      wsClient.onmessage = (message) => {
        let isChange = false;

        const wb = localStorage.getItem("wb")
          ? JSON.parse(localStorage.getItem("wb"))
          : {
              weight: -1,
              lastChange: 0,
              isStable: false,
              onProcessing: false,
              canStartScalling: false,
            };

        const curWb = { ...wb };
        curWb.weight = Number.isNaN(+message.data) ? 0 : +message.data;

        if (curWb.weight !== wb.weight) {
          isChange = true;

          curWb.lastChange = moment().valueOf();
          curWb.isStable = false;
        } else if (moment().valueOf() - wb.lastChange > WBMS?.WB_STABLE_PERIOD && !curWb.isStable) {
          isChange = true;

          curWb.isStable = true;
        }

        // ini ada kelemahan jika pindah page dari menu sidebar ketika transaksi, dia tetap on processing
        if (curWb.weight === 0 && curWb.isStable && !curWb.onProcessing && !curWb.canStartScalling) {
          isChange = true;

          curWb.canStartScalling = true;
        }

        // else if (curWb.weight > 0 && !curWb.onProcessing && curWb.canStartScalling) {
        //   // Ini kemungkinan salah
        //   isChange = true;

        //   curWb.canStartScalling = false;
        // }

        if (curWb.onProcessing && curWb.canStartScalling) {
          isChange = true;

          curWb.canStartScalling = false;
        }

        // karena ada dispatch on message, jd penggunaan hooks weighbridge harus dicomponent terkecil
        if (isChange) dispatch(wbRedux.setWb({ ...curWb }));
      };

      wsClient.onerror = (err) => {
        // alert(`Cannot connect to WB: ${err}`);
        console.log("Error Get Data from Serial Weighbridge:", err);
      };
    }
  };

  return { wb, setWb, initWB };
};
