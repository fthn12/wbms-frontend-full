import { useDispatch, useSelector } from "react-redux";

import * as configRedux from "../slices/config/configSlice";
import { getConfigs } from "../slices/config/configSliceApi";

// const sccModel = {
//   0: "None",
//   1: "Mass Balance",
//   2: "Segregated",
//   3: "Identity Preserved",
// };

const progressStatus = {
  0: "TIMBANG WB-IN",
  1: "LOADING",
  2: "UNLOADING",

  5: "CANCEL WB-IN",
  6: "CANCEL UNLOADING",

  10: "REJECT WB-IN",
  11: "REJECT UNLOADING",

  19: "TIMBANG WB-OUT",
  20: "PENGIRIMAN T300",
  21: "COMPLETE EDISPATCH",

  25: "CANCEL WB-OUT",
  26: "CANCEL TERSIMPAN",

  30: "REJECT WB-OUT",
  31: "REJECT TERSIMPAN",

  35: "PENDING TBS",
  36: "PENDING KERNEL",
  37: "PENDING OTHERS",

  40: "COMPLETE TBS",
  41: "COMPLETE KERNEL",
  42: "COMPLETE OTHERS",

  100: "DELETED TRANSAKSI",
};

const pksProgressStatus = {
  0: "TIMBANG MASUK",
  1: "LOADING/UNLOADING",
  2: "TIMBANG KELUAR",
  3: "DATA DISPATCHED",
  4: "DATA DISPATCHED",
  5: "CANCEL TIMBANG MASUK",
  6: "CANCEL UNLOADING",
  7: "CANCEL TIMBANG KELUAR",
  8: "CANCEL SUBMITTED",
  9: "CANCEL SUBMITTED",
  10: "REJECT TIMBANG MASUK",
  11: "REJECT UNLOADING",
  12: "REJECT TIMBANG KELUAR",
  13: "REJECT SUBMITTED",
  14: "REJECT SUBMITTED",
  15: "SELESAI",
};

const t30ProgressStatus = {
  0: "TIMBANG MASUK",
  1: "LOADING/UNLOADING",
  2: "TIMBANG KELUAR",
  3: "DATA DISPATCHED",
  4: "DATA DISPATCHED",
  5: "CANCEL TIMBANG MASUK",
  6: "CANCEL UNLOADING",
  7: "CANCEL TIMBANG KELUAR",
  8: "CANCEL SUBMITTED",
  9: "CANCEL SUBMITTED",
  15: "SELESAI",
};

const bulkingProgressStatus = {
  0: "TIMBANG MASUK",
  1: "UNLOADING",
  2: "TIMBANG KELUAR",
  3: "DATA SUBMITED",
  4: "DATA SUBMITED",
  12: "REJECT TIMBANG KELUAR",
  13: "REJECT SUBMITTED",
  14: "REJECT SUBMITTED",
  15: "SELESAI",
};

const mdSource = {
  0: "WBMS",
  1: "eDispatch",
};

const roles = [
  { id: 0, value: "Not Assigned" },
  { id: 1, value: "Operator" },
  { id: 2, value: "Supervisor" },
  { id: 3, value: "Manager" },
  { id: 4, value: "Admin HC" },
  { id: 5, value: "Admin System" },
  { id: 6, value: "Admin IT" },
];

const productTypes = [
  // { id: 0, value: "Not Assigned" },
  { id: 1, value: "Dispatch" },
  { id: 2, value: "TBS" },
  { id: 3, value: "Kernel" },
  { id: 4, value: "Others" },
];

const eDispatchServer = [
  { id: 1, value: "API SERVER 1 (primary)" },
  { id: 2, value: "API SERVER 2 (secondary)" },
];

const siteTypes = [
  { id: 1, value: "PKS" },
  { id: 2, value: "T30" },
  { id: 3, value: "Bulking" },
];

const sccModel = [
  { id: 0, value: "None" },
  { id: 1, value: "Mass Balance" },
  { id: 2, value: "Segregated" },
  { id: 3, value: "Identity Preserved" },
];

const vaSccModel = [
  { id: 0, value: "None" },
  { id: 1, value: "Mass Balance" },
  { id: 2, value: "Segregated" },
  { id: 3, value: "Identity Preserved" },
];

const rspoSccModel = [
  { id: 0, value: "None" },
  { id: 1, value: "Mass Balance" },
  { id: 2, value: "Segregated" },
  { id: 3, value: "Identity Preserved" },
];

const isccSccModel = [
  { id: 0, value: "None" },
  { id: 1, value: "Mass Balance" },
  { id: 2, value: "Segregated" },
  { id: 3, value: "Identity Preserved" },
];

export const useConfig = () => {
  const dispatch = useDispatch();

  // get value of state
  const {
    ENV,
    WBMS,
    PROGRESS_STATUS,
    PKS_PROGRESS_STATUS,
    T30_PROGRESS_STATUS,
    BULKING_PROGRESS_STATUS,
    MD_SOURCE,
    ROLES,
    EDISPATCH_SERVER,
    SITE_TYPES,
    PRODUCT_TYPES,
    SCC_MODEL,
    VA_SCC_MODEL,
    RSPO_SCC_MODEL,
    ISCC_SCC_MODEL,
  } = useSelector((state) => state.configs);

  const initialData = {
    ENV: process.env,

    PROGRESS_STATUS: progressStatus,
    PKS_PROGRESS_STATUS: pksProgressStatus,
    T30_PROGRESS_STATUS: t30ProgressStatus,
    BULKING_PROGRESS_STATUS: bulkingProgressStatus,
    MD_SOURCE: mdSource,
    ROLES: roles,
    EDISPATCH_SERVER: eDispatchServer,
    SITE_TYPES: siteTypes,
    PRODUCT_TYPES: productTypes,
    SCC_MODEL: sccModel,
    VA_SCC_MODELL: vaSccModel,
    RSPO_SCC_MODE: rspoSccModel,
    ISCC_SCC_MODEL: isccSccModel,
  };



  const syncConfig = () => {
    dispatch(getConfigs());
    dispatch(configRedux.setConfigs(initialData));
  };

  return {
    ENV,
    WBMS,
    PROGRESS_STATUS,
    PKS_PROGRESS_STATUS,
    T30_PROGRESS_STATUS,
    BULKING_PROGRESS_STATUS,
    MD_SOURCE,
    ROLES,
    EDISPATCH_SERVER,
    SITE_TYPES,
    PRODUCT_TYPES,
    SCC_MODEL,
    VA_SCC_MODEL,
    RSPO_SCC_MODEL,
    ISCC_SCC_MODEL,
    syncConfig,
  };
};
