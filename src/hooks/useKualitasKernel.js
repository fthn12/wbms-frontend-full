import {
  useGetKualitasKernelQuery,
  useCreateKualitasKernelMutation,
  useFindFirstKualitasKernelQuery,
  useFindManyKualitasKernelQuery,
} from "../slices/kualitas/kualitasKernelSliceApi";

export const useKualitasKernel = () => {
  return {
    useGetKualitasKernelQuery,
    useCreateKualitasKernelMutation,
    useFindFirstKualitasKernelQuery,
    useFindManyKualitasKernelQuery,
  };
};
