import {
  useGetProductsQuery,
  useEDispatchProductSyncMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useFindManyProductQuery,
} from "../slices/master-data/productSliceApi";

export const useProduct = () => {
  return {
    useGetProductsQuery,
    useEDispatchProductSyncMutation,
    useUpdateProductMutation,
    useCreateProductMutation,
    useDeleteProductMutation,
    useFindManyProductQuery,
  };
};
