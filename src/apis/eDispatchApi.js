import { useAxios } from "../hooks";

export const EDispatchAPI = () => {
  const { axios } = useAxios();
  const endpoint = "edispatch";

  const EncodeQrcode = async (data) => {
    const response = await axios.post(`${endpoint}/encode-qrcode`, data).then((res) => res.data);

    return response;
  };

  return { EncodeQrcode };
};

export const getT30Site = () => {
  const t30 = {
    code: "T30",
    companyId: "1ebcf18d-249f-6976-a935-2191b934b823",
    companyName: "PT DHARMA SATYA NUSANTARA",
    createdBy: "user01",
    createdTime: "2022-10-16T08:37:57+0000",
    description: "Desa Miau Baru, Kec. Kongbeng",
    id: "1ed4d2dd-5f82-6d72-a734-af3611b77aab",
    isDeleted: 0,
    isMill: false,
    latitude: 1.27632,
    longitude: 116.889,
    name: "T30",
    shortName: "T30",
    solarCalibration: 14,
    syncedStatus: 1,
    syncedTime: "2023-01-09T00:27:42+0000",
    updatedBy: "user01",
    updatedTime: "2022-10-16T08:37:57+0000",
    version: 2,
  };

  return t30;
};

export const getBulkingSite = () => {
  const data = {
    code: "DS14/DI14/SW14",
    companyId: "1ebcf18d-249f-6976-a935-2191b934b823",
    companyName: "PT DHARMA SATYA NUSANTARA",
    createdBy: "user01",
    createdTime: "2022-10-16T08:38:43+0000",
    description: "Jalan Petani 2, Desa Labanan, Kec. Teluk Bayur",
    id: "1ed4d2df-187a-6f7b-a734-af3611b77aab",
    isDeleted: 0,
    isMill: false,
    latitude: 2.09176,
    longitude: 117.322,
    name: "Bulking Station Labanan",
    sourceSiteId: "1ed4d2df-187a-6f7b-a734-af3611b77aab",
    sourceSiteName: "Bulking Station Labanan",
    syncedStatus: 1,
    syncedTime: "2023-04-16T14:37:32+0000",
    updatedBy: "it.admin",
    updatedTime: "2023-04-16T14:37:32+0000",
    version: 3,
  };

  return data;
};
