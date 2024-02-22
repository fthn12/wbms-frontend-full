import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import RequireAuth from "../components/layout/signed/RequireAuth";
import NoRequireAuth from "../components/layout/public/NoRequireAuth";

// Containers
const LayoutPublic = lazy(() => import("../components/layout/public/LayoutPublic"));
const LayoutSigned = lazy(() => import("../components/layout/signed/LayoutSigned"));

// Pages
const Home = lazy(() => import("../pages/Home"));
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const Setup = lazy(() => import("../pages/app/Setup"));
const Page404 = lazy(() => import("../pages/Page404"));
const Page500 = lazy(() => import("../pages/Page500"));

const DashboardAll = lazy(() => import("../pages/dashboard/dashboard-all"));

const Transactions = lazy(() => import("../pages/transactions"));
const TransactionsManualEntry = lazy(() => import("../pages/transactionsManualEntryNetto"));

const ManualEntryBackDate = lazy(() => import("../pages/transactionsManualEntryNetto/backDate/form"));

const PksManualEntryNettoIn = lazy(() => import("../pages/transactionsManualEntryNetto/pks/wb-in"));

const PksManualEntryNettoOutOthers = lazy(() => import("../pages/transactionsManualEntryNetto/pks/others/out"));
const PksManualEntryNettoOutKernel = lazy(() => import("../pages/transactionsManualEntryNetto/pks/kernel/out"));
const PksManualEntryNettoOutTbs = lazy(() => import("../pages/transactionsManualEntryNetto/pks/tbs/out"));

const PksManualEntryNettoOthersView = lazy(() => import("../pages/transactionsManualEntryNetto/pks/others/view"));
const PksManualEntryNettoTbsView = lazy(() => import("../pages/transactionsManualEntryNetto/pks/tbs/view"));
const PksManualEntryNettoKernelView = lazy(() => import("../pages/transactionsManualEntryNetto/pks/kernel/view"));

const PksManualEntryIn = lazy(() => import("../pages/transactionsManualEntry/pks/wb-in"));

const PksManualEntryOutOthers = lazy(() => import("../pages/transactionsManualEntry/pks/others/out"));
const PksManualEntryOutKernel = lazy(() => import("../pages/transactionsManualEntry/pks/kernel/out"));
const PksManualEntryOutTbs = lazy(() => import("../pages/transactionsManualEntry/pks/tbs/out"));

const PksManualEntryOthersView = lazy(() => import("../pages/transactionsManualEntry/pks/others/view"));
const PksManualEntryTbsView = lazy(() => import("../pages/transactionsManualEntry/pks/tbs/view"));
const PksManualEntryKernelView = lazy(() => import("../pages/transactionsManualEntry/pks/kernel/view"));

const PksNormalIn = lazy(() => import("../pages/transactions/pks/NormalIn"));
const PksNormalOut = lazy(() => import("../pages/transactions/pks/NormalOut"));
const PksCancelIn = lazy(() => import("../pages/transactions/pks/CancelIn"));
const PksCancelOut = lazy(() => import("../pages/transactions/pks/CancelOut"));
const PksRejectT300In = lazy(() => import("../pages/transactions/pks/RejectT300In"));
const PksRejectBulkingIn = lazy(() => import("../pages/transactions/pks/RejectBulkingIn"));
const PksRejectOut = lazy(() => import("../pages/transactions/pks/RejectOut"));

const PksNormalInView = lazy(() => import("../pages/transactions/pks/NormalIn/view"));
const PksNormalOutView = lazy(() => import("../pages/transactions/pks/NormalOut/view"));
const PksCancelInView = lazy(() => import("../pages/transactions/pks/CancelIn/view"));
const PksCancelOutView = lazy(() => import("../pages/transactions/pks/CancelOut/view"));
const PksRejectT300InView = lazy(() => import("../pages/transactions/pks/RejectT300In/view"));
const PksRejectBulkingInView = lazy(() => import("../pages/transactions/pks/RejectBulkingIn/view"));
const PksRejectOutView = lazy(() => import("../pages/transactions/pks/RejectOut/view"));
const PksEDispatchNew = lazy(() => import("../pages/transactions/pks/new"));

const T30ManualEntryNettoIn = lazy(() => import("../pages/transactionsManualEntryNetto/t30/wb-in"));
const T30ManualEntryNettoOutOthers = lazy(() => import("../pages/transactionsManualEntryNetto/t30/others/out"));
const T30ManualEntryNettoOthersView = lazy(() => import("../pages/transactionsManualEntryNetto/t30/others/view"));

const T30ManualEntryIn = lazy(() => import("../pages/transactionsManualEntry/t30/wb-in"));

const T30ManualEntryOutDispatch = lazy(() => import("../pages/transactionsManualEntry/t30/dispatch/out"));
const T30ManualEntryDispatchView = lazy(() => import("../pages/transactionsManualEntry/t30/dispatch/view"));

const T30ManualEntryOutOthers = lazy(() => import("../pages/transactionsManualEntry/t30/others/out"));
const T30ManualEntryOthersView = lazy(() => import("../pages/transactionsManualEntry/t30/others/view"));

const T30NormalIn = lazy(() => import("../pages/transactions/t30/NormalIn"));
const T30NormalOut = lazy(() => import("../pages/transactions/t30/NormalOut"));
const T30CancelIn = lazy(() => import("../pages/transactions/t30/CancelIn"));
const T30CancelOut = lazy(() => import("../pages/transactions/t30/CancelOut"));

const T30NormalInView = lazy(() => import("../pages/transactions/t30/NormalIn/view"));
const T30NormalOutView = lazy(() => import("../pages/transactions/t30/NormalOut/view"));
const T30CancelInView = lazy(() => import("../pages/transactions/t30/CancelIn/view"));
const T30CancelOutView = lazy(() => import("../pages/transactions/t30/CancelOut/view"));
const T30DeletedView = lazy(() => import("../pages/transactions/t30/Deleted/view"));

const BulkingManualEntryNettoIn = lazy(() => import("../pages/transactionsManualEntryNetto/bulking/wb-in"));
const BulkingManualEntryNettoOutOthers = lazy(() => import("../pages/transactionsManualEntryNetto/bulking/others/out"));
const BulkingManualEntryNettoOthersView = lazy(() =>
  import("../pages/transactionsManualEntryNetto/bulking/others/view"),
);

const BulkingManualEntryIn = lazy(() => import("../pages/transactionsManualEntry/bulking/wb-in"));
const BulkingManualEntryOutOthers = lazy(() => import("../pages/transactionsManualEntry/bulking/others/out"));
const BulkingManualEntryOthersView = lazy(() => import("../pages/transactionsManualEntry/bulking/others/view"));

const BulkingIn = lazy(() => import("../pages/transactions/bulking/In"));
const BulkingOut = lazy(() => import("../pages/transactions/bulking/Out"));

const ReportTransactionDaily = lazy(() => import("../pages/reports/transactions-daily"));

// const MDProvince = lazy(() => import("../pages/master-data/md-province"));
// const MDCity = lazy(() => import("../pages/master-data/md-city"));
const MDProduct = lazy(() => import("../pages/master-data/md-product"));
const MDSite = lazy(() => import("../pages/master-data/md-site"));
const MDStorageTank = lazy(() => import("../pages/master-data/md-storage-tank"));
const MDTransportVehicle = lazy(() => import("../pages/master-data/md-transport-vehicle"));
const MDCompany = lazy(() => import("../pages/master-data/md-company"));
const MDDriver = lazy(() => import("../pages/master-data/md-driver"));

const AdmUser = lazy(() => import("../pages/administration/user-management/users"));
const AdmUserCreate = lazy(() => import("../pages/administration/user-management/users/user-create"));
const AdmUserView = lazy(() => import("../pages/administration/user-management/users/user-view"));

const Config = lazy(() => import("../pages/administration/config-variable"));

const routes = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route element={<NoRequireAuth />}>
        <Route path="/" element={<LayoutPublic />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="setup" element={<Setup />} />
          <Route path="signin" element={<SignIn />} />
          <Route exact path="404" name="Page 404" element={<Page404 />} />
          <Route exact path="500" name="Page 500" element={<Page500 />} />
        </Route>
      </Route>

      {/* protected routes */}
      <Route element={<RequireAuth />}>
        <Route path="/wb" element={<LayoutSigned />}>
          <Route index element={<DashboardAll />} />
          <Route path="dashboard/all" element={<DashboardAll />} />
          <Route path="dashboard/pks" element={<div>Dashboard PKS</div>} />
          <Route path="dashboard/t30" element={<div>Dashboard T30</div>} />
          <Route path="dashboard/labanan" element={<div>Dashboard Labanan</div>} />

          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/manual-entry" element={<TransactionsManualEntry />} />

          <Route path="transactions/pks-edispatch-normal-in" element={<PksNormalIn />} />
          <Route path="transactions/pks-edispatch-normal-out" element={<PksNormalOut />} />
          <Route path="transactions/pks-edispatch-cancel-in" element={<PksCancelIn />} />
          <Route path="transactions/pks-edispatch-cancel-out" element={<PksCancelOut />} />
          <Route path="transactions/pks-edispatch-reject-t300-in" element={<PksRejectT300In />} />
          <Route path="transactions/pks-edispatch-reject-bulking-in" element={<PksRejectBulkingIn />} />
          <Route path="transactions/pks-edispatch-reject-out" element={<PksRejectOut />} />

          <Route path="transactions/pks-edispatch-normal-in/:id" element={<PksNormalInView />} />
          <Route path="transactions/pks-edispatch-normal-out/:id" element={<PksNormalOutView />} />
          <Route path="transactions/pks-edispatch-cancel-in/:id" element={<PksCancelInView />} />
          <Route path="transactions/pks-edispatch-cancel-out/:id" element={<PksCancelOutView />} />
          <Route path="transactions/pks-edispatch-reject-t300-in/:id" element={<PksRejectT300InView />} />
          <Route path="transactions/pks-edispatch-reject-bulking-in/:id" element={<PksRejectBulkingInView />} />
          <Route path="transactions/pks-edispatch-reject-out/:id" element={<PksRejectOutView />} />

          <Route path="transactions/pks-new" element={<PksEDispatchNew />} />

          <Route path="transactions/pks-new-backdate" element={<ManualEntryBackDate />} />

          <Route
            path="transactions/pks/manual-entry-netto-in"
            name="PksManualEntryNettoWbIn"
            element={<PksManualEntryNettoIn />}
          />

          <Route
            path="transactions/pks/manual-entry-others-netto-out/:id"
            name="PksManualEntryNettoOutOthers"
            element={<PksManualEntryNettoOutOthers />}
          />
          <Route
            path="transactions/pks/manual-entry-kernel-netto-out/:id"
            name="PksManualEntryNettoOutKernel"
            element={<PksManualEntryNettoOutKernel />}
          />
          <Route
            path="transactions/pks/manual-entry-tbs-netto-out/:id"
            name="PksManualEntryNettoOutTbs"
            element={<PksManualEntryNettoOutTbs />}
          />

          <Route
            path="transactions/pks/manual-entry-other-netto-view/:id"
            name="PksManualEntryNettoOthersView"
            element={<PksManualEntryNettoOthersView />}
          />
          <Route
            path="transactions/pks/manual-entry-tbs-netto-view/:id"
            name="PksManualEntryNettoTbsView"
            element={<PksManualEntryNettoTbsView />}
          />
          <Route
            path="transactions/pks/manual-entry-kernel-netto-view/:id"
            name="PksManualEntryNettoKernelView"
            element={<PksManualEntryNettoKernelView />}
          />

          <Route path="transactions/pks/manual-entry-in" name="PksManualEntryWbIn" element={<PksManualEntryIn />} />

          <Route
            path="transactions/pks/manual-entry-others-out/:id"
            name="PksManualEntryOutOthers"
            element={<PksManualEntryOutOthers />}
          />
          <Route
            path="transactions/pks/manual-entry-kernel-out/:id"
            name="PksManualEntryOutKernel"
            element={<PksManualEntryOutKernel />}
          />
          <Route
            path="transactions/pks/manual-entry-tbs-out/:id"
            name="PksManualEntryOutTbs"
            element={<PksManualEntryOutTbs />}
          />

          <Route
            path="transactions/pks/manual-entry-other-view/:id"
            name="PksManualEntryOthersView"
            element={<PksManualEntryOthersView />}
          />
          <Route
            path="transactions/pks/manual-entry-tbs-view/:id"
            name="PksManualEntryTbsView"
            element={<PksManualEntryTbsView />}
          />
          <Route
            path="transactions/pks/manual-entry-kernel-view/:id"
            name="PksManualEntryKernelView"
            element={<PksManualEntryKernelView />}
          />

          <Route
            path="transactions/t30/manual-entry-netto-in"
            name="T30ManualEntryNettoWbIn"
            element={<T30ManualEntryNettoIn />}
          />
          <Route
            path="transactions/t30/manual-entry-others-netto-out/:id"
            name="T30ManualEntryNettoOutOthers"
            element={<T30ManualEntryNettoOutOthers />}
          />
          <Route
            path="transactions/t30/manual-entry-others-netto-view/:id"
            name="T30ManualEntryNettoOthersView"
            element={<T30ManualEntryNettoOthersView />}
          />

          <Route path="transactions/t30/manual-entry-in" name="T30ManualEntryWbIn" element={<T30ManualEntryIn />} />

          <Route
            path="transactions/t30/manual-entry-dispatch-out/:id"
            name="T30ManualEntryOutDispatch"
            element={<T30ManualEntryOutDispatch />}
          />
          <Route
            path="transactions/t30/manual-entry-dispatch-view/:id"
            name="T30ManualEntryDispatchView"
            element={<T30ManualEntryDispatchView />}
          />

          <Route
            path="transactions/t30/manual-entry-others-out/:id"
            name="T30ManualEntryOutOthers"
            element={<T30ManualEntryOutOthers />}
          />
          <Route
            path="transactions/t30/manual-entry-others-view/:id"
            name="T30ManualEntryOthersView"
            element={<T30ManualEntryOthersView />}
          />

          <Route path="transactions/t30-edispatch-normal-in" element={<T30NormalIn />} />
          <Route path="transactions/t30-edispatch-normal-out" element={<T30NormalOut />} />
          <Route path="transactions/t30-edispatch-cancel-in" element={<T30CancelIn />} />
          <Route path="transactions/t30-edispatch-cancel-out" element={<T30CancelOut />} />

          <Route path="transactions/t30-edispatch-normal-in/:id" element={<T30NormalInView />} />
          <Route path="transactions/t30-edispatch-normal-out/:id" element={<T30NormalOutView />} />
          <Route path="transactions/t30-edispatch-cancel-in/:id" element={<T30CancelInView />} />
          <Route path="transactions/t30-edispatch-cancel-out/:id" element={<T30CancelOutView />} />
          <Route path="transactions/t30-edispatch-deleted/:id" element={<T30DeletedView />} />

          <Route
            path="transactions/bulking/manual-entry-netto-in"
            name="BulkingManualEntryWbIn"
            element={<BulkingManualEntryNettoIn />}
          />
          <Route
            path="transactions/bulking/manual-entry-others-netto-out/:id"
            name="BulkingManualEntryNettoOutOthers"
            element={<BulkingManualEntryNettoOutOthers />}
          />
          <Route
            path="transactions/bulking/manual-entry-others-netto-view/:id"
            name="BulkingManualEntryNettoOthersView"
            element={<BulkingManualEntryNettoOthersView />}
          />

          <Route
            path="transactions/bulking/manual-entry-in"
            name="BulkingManualEntryWbIn"
            element={<BulkingManualEntryIn />}
          />
          <Route
            path="transactions/bulking/manual-entry-others-out/:id"
            name="BulkingManualEntryOutOthers"
            element={<BulkingManualEntryOutOthers />}
          />
          <Route
            path="transactions/bulking/manual-entry-others-view/:id"
            name="BulkingManualEntryOthersView"
            element={<BulkingManualEntryOthersView />}
          />

          <Route path="transactions/bulking-edispatch-in" element={<BulkingIn />} />
          <Route path="transactions/bulking-edispatch-out" element={<BulkingOut />} />

          <Route path="reports/transactions-daily" element={<ReportTransactionDaily />} />
          {/* <Route path="md/provinces" element={<MDProvince />} />
          <Route path="md/cities" element={<MDCity />} /> */}
          <Route path="md/products" element={<MDProduct />} />
          <Route path="md/sites" element={<MDSite />} />
          <Route path="md/storage-tanks" element={<MDStorageTank />} />
          <Route path="md/transport-vehicles" element={<MDTransportVehicle />} />
          <Route path="md/companies" element={<MDCompany />} />
          <Route path="md/drivers" element={<MDDriver />} />

          <Route path="administration/configs/:id" element={<Config />} />

          <Route path="administration/users" element={<AdmUser />} />
          <Route path="administration/users/add" element={<AdmUserCreate />} />
          <Route path="administration/users/:id" element={<AdmUserView />} />
          <Route path="*" name="Page 404" element={<div>Page 404 Transaksi WB</div>} />
        </Route>
      </Route>

      <Route path="*" name="Page 404" element={<div>Page 404 Public</div>} />
    </Routes>
  );
};

export default routes;
