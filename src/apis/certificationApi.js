import { useAxios } from "../hooks";

export const getVA_SCC_MODEL = () => {
  const response = {
    data: [
      { id: 0, value: "None" },
      { id: 1, value: "Mass Balance" },
      { id: 2, value: "Segregated" },
      { id: 3, value: "Identity Preserved" },
    ],
  };
  return response.data;
};

export const getRSPO_SCC_MODEL = () => {
  const response = {
    data: [
      { id: 0, value: "None" },
      { id: 1, value: "Mass Balance" },
      { id: 2, value: "Segregated" },
      { id: 3, value: "Identity Preserved" },
    ],
  };
  return response.data;
};

export const getISCC_SCC_MODEL = () => {
  const response = {
    data: [
      { id: 0, value: "None" },
      { id: 1, value: "Mass Balance" },
      { id: 2, value: "Segregated" },
      { id: 3, value: "Identity Preserved" },
    ],
  };
  return response.data;
};

export const CertificationAPI = () => {
  const { axios } = useAxios();
  const endpoint = "certifications";

  const SccVA = async (data) => {
    const response = await axios.post(`${endpoint}/scc-va`, data).then((res) => res.data);

    return response;
  };

  const SccRSPO = async (data) => {
    const response = await axios.post(`${endpoint}/scc-rspo`, data).then((res) => res.data);

    return response;
  };

  const SccISCC = async (data) => {
    const response = await axios.post(`${endpoint}/scc-iscc`, data).then((res) => res.data);

    return response;
  };

  const SccISPO = async (data) => {
    const response = await axios.post(`${endpoint}/scc-ispo`, data).then((res) => res.data);

    return response;
  };

  return { SccVA, SccRSPO, SccISCC, SccISPO };
};
