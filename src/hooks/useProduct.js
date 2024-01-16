import {
  useGetProductsQuery,
  useEDispatchProductSyncMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../slices/master-data/productSliceApi";

export const useProduct = () => {
  return {
    useGetProductsQuery,
    useEDispatchProductSyncMutation,
    useUpdateProductMutation,
    useCreateProductMutation,
    useDeleteProductMutation,
  };
};
