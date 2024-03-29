import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import RequireAuth from "../components/layout/signed/RequireAuth";
import NoRequireAuth from "../components/layout/public/NoRequireAuth";

// Containers
const LayoutPublic = lazy(() =>
  import("../components/layout/public/LayoutPublic")
);
const LayoutSigned = lazy(() =>
  import("../components/layout/signed/LayoutSigned")
);

// Pages
const Home = lazy(() => import("../pages/Home"));
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const Setup = lazy(() => import("../pages/app/Setup"));
const Page404 = lazy(() => import("../pages/Page404"));
const Page500 = lazy(() => import("../pages/Page500"));

const DashboardAll = lazy(() => import("../pages/dashboard/dashboard-all"));

const Transactions = lazy(() => import("../pages/transactions"));

const TransactionsForm = lazy(() =>
  import("../pages/transactionsBackDate/Form")
);

const PksManualEntryIn = lazy(() =>
  import("../pages/transactionsManualEntry/pks/wb-in")
);

const PksManualEntryFinalizeT300 = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/finalizeT300")
);

const PksManualEntryOutOthers = lazy(() =>
  import("../pages/transactionsManualEntry/pks/others/out")
);
const PksManualEntryOutKernel = lazy(() =>
  import("../pages/transactionsManualEntry/pks/kernel/out")
);
const PksManualEntryOutTbs = lazy(() =>
  import("../pages/transactionsManualEntry/pks/tbs/out")
);
const PksManualEntryOutDispatch = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/normalout")
);

const PksManualEntryOthersView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/others/view")
);
const PksManualEntryTbsView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/tbs/view")
);
const PksManualEntryKernelView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/kernel/view")
);
const PksManualEntryDispatchView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/normalout/view")
);

const PksManualEntryDispatchCancelIn = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/cancelin")
);
const PksManualEntryDispatchCancelInView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/cancelin/view")
);
const PksManualEntryDispatchCancelOut = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/cancelout")
);
const PksManualEntryDispatchCancelOutView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/cancelout/view")
);

const PksRejectT300InManual = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/rejectT300/in")
);
const PksRejectT300InManualView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/rejectT300/in/view")
);
const PksRejectT300OutManual = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/rejectT300/out")
);
const PksRejectT300OutManualView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/rejectT300/out/view")
);
const RejectBulkingInManual = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/rejectBulking/in")
);
const RejectBulkingInManualView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/rejectBulking/in/view")
);
const RejectBulkingOutManual = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/rejectBulking/out")
);
const RejectBulkingOutManualView = lazy(() =>
  import("../pages/transactionsManualEntry/pks/dispatch/rejectBulking/out/view")
);

const PksBackDate = lazy(() =>
  import("../pages/transactionsBackDate/Form/pks")
);

const PksBackDateDispatchNormalView = lazy(() =>
  import("../pages/transactionsBackDate/Form/pks/dispatch/normal/view")
);
const PksBackDateDispatchCancelView = lazy(() =>
  import("../pages/transactionsBackDate/Form/pks/dispatch/cancel/view")
);
const PksBackDateDispatchRejectT300View = lazy(() =>
  import("../pages/transactionsBackDate/Form/pks/dispatch/rejectT300/view")
);
const PksBackDateDispatchRejectBulkingView = lazy(() =>
  import("../pages/transactionsBackDate/Form/pks/dispatch/rejectBulking/view")
);
const PksBackDateTbsView = lazy(() =>
  import("../pages/transactionsBackDate/Form/pks/tbs/view")
);
const PksBackDateKernelView = lazy(() =>
  import("../pages/transactionsBackDate/Form/pks/kernel/view")
);
const PksBackDateOthersView = lazy(() =>
  import("../pages/transactionsBackDate/Form/pks/others/view")
);

const PksNormalIn = lazy(() => import("../pages/transactions/pks/NormalIn"));
const PksNormalOut = lazy(() => import("../pages/transactions/pks/NormalOut"));
const PksCancelIn = lazy(() => import("../pages/transactions/pks/CancelIn"));
const PksCancelOut = lazy(() => import("../pages/transactions/pks/CancelOut"));
const PksRejectT300In = lazy(() =>
  import("../pages/transactions/pks/RejectT300In")
);
const PksRejectBulkingIn = lazy(() =>
  import("../pages/transactions/pks/RejectBulkingIn")
);
const PksRejectOut = lazy(() => import("../pages/transactions/pks/RejectOut"));

const PksNormalInView = lazy(() =>
  import("../pages/transactions/pks/NormalIn/view")
);
const PksNormalOutView = lazy(() =>
  import("../pages/transactions/pks/NormalOut/view")
);
const PksCancelInView = lazy(() =>
  import("../pages/transactions/pks/CancelIn/view")
);
const PksCancelOutView = lazy(() =>
  import("../pages/transactions/pks/CancelOut/view")
);
const PksRejectT300InView = lazy(() =>
  import("../pages/transactions/pks/RejectT300In/view")
);
const PksRejectBulkingInView = lazy(() =>
  import("../pages/transactions/pks/RejectBulkingIn/view")
);
const PksRejectOutView = lazy(() =>
  import("../pages/transactions/pks/RejectOut/view")
);
const PksEDispatchNew = lazy(() => import("../pages/transactions/pks/new"));

const T30ManualEntryIn = lazy(() =>
  import("../pages/transactionsManualEntry/t30/wb-in")
);

const T30ManualEntryOutDispatch = lazy(() =>
  import("../pages/transactionsManualEntry/t30/dispatch/normalout")
);
const T30ManualEntryOutOthers = lazy(() =>
  import("../pages/transactionsManualEntry/t30/others/out")
);

const T30ManualEntryDispatchView = lazy(() =>
  import("../pages/transactionsManualEntry/t30/dispatch/normalout/view")
);
const T30ManualEntryOthersView = lazy(() =>
  import("../pages/transactionsManualEntry/t30/others/view")
);

const T30ManualEntryDispatchCancelIn = lazy(() =>
  import("../pages/transactionsManualEntry/t30/dispatch/cancelin")
);
const T30ManualEntryDispatchCancelInView = lazy(() =>
  import("../pages/transactionsManualEntry/t30/dispatch/cancelin/view")
);
const T30ManualEntryDispatchCancelOut = lazy(() =>
  import("../pages/transactionsManualEntry/t30/dispatch/cancelout")
);
const T30ManualEntryDispatchCancelOutView = lazy(() =>
  import("../pages/transactionsManualEntry/t30/dispatch/cancelout/view")
);

const T30BackDate = lazy(() =>
  import("../pages/transactionsBackDate/Form/t30")
);
const T30BackDateDispatchNormalView = lazy(() =>
  import("../pages/transactionsBackDate/Form/t30/dispatch/normal/view")
);
const T30BackDateDispatchCancelView = lazy(() =>
  import("../pages/transactionsBackDate/Form/t30/dispatch/cancel/view")
);
const T30BackDateOthersView = lazy(() =>
  import("../pages/transactionsBackDate/Form/t30/others/view")
);

const T30NormalIn = lazy(() => import("../pages/transactions/t30/NormalIn"));
const T30NormalOut = lazy(() => import("../pages/transactions/t30/NormalOut"));
const T30CancelIn = lazy(() => import("../pages/transactions/t30/CancelIn"));
const T30CancelOut = lazy(() => import("../pages/transactions/t30/CancelOut"));

const T30NormalInView = lazy(() =>
  import("../pages/transactions/t30/NormalIn/view")
);
const T30NormalOutView = lazy(() =>
  import("../pages/transactions/t30/NormalOut/view")
);
const T30CancelInView = lazy(() =>
  import("../pages/transactions/t30/CancelIn/view")
);
const T30CancelOutView = lazy(() =>
  import("../pages/transactions/t30/CancelOut/view")
);
const T30DeletedView = lazy(() =>
  import("../pages/transactions/t30/Deleted/view")
);

const BulkingManualEntryIn = lazy(() =>
  import("../pages/transactionsManualEntry/bulking/wb-in")
);
const BulkingManualEntryInQR = lazy(() =>
  import("../pages/transactionsManualEntry/bulking/dispatch/in/in-qr")
);
const BulkingManualEntryDispatchOut = lazy(() =>
  import("../pages/transactionsManualEntry/bulking/dispatch/out")
);
const BulkingManualEntryOutOthers = lazy(() =>
  import("../pages/transactionsManualEntry/bulking/others/out")
);

const BulkingManualEntryDispatchView = lazy(() =>
  import("../pages/transactionsManualEntry/bulking/dispatch/out/view")
);
const BulkingManualEntryOthersView = lazy(() =>
  import("../pages/transactionsManualEntry/bulking/others/view")
);

const BulkingBackDate = lazy(() =>
  import("../pages/transactionsBackDate/Form/bulking")
);

const BulkingBackDateDispatchView = lazy(() =>
  import("../pages/transactionsBackDate/Form/bulking/dispatch/view")
);
const BulkingBackDateOthersView = lazy(() =>
  import("../pages/transactionsBackDate/Form/bulking/others/view")
);

const BulkingIn = lazy(() => import("../pages/transactions/bulking/In"));
const BulkingOut = lazy(() => import("../pages/transactions/bulking/Out"));
const BulkingViewIn = lazy(() =>
  import("../pages/transactions/bulking/In/view")
);
const BulkingViewOut = lazy(() =>
  import("../pages/transactions/bulking/Out/view")
);

const ReportTransactionDaily = lazy(() =>
  import("../pages/reports/transactions-daily")
);

const TransactionOnGoing = lazy(() => import("../pages/transactionGridManualEntry/manualEntryGrid/pending"));
const TransactionComplete = lazy(() =>
  import("../pages/transactionGridManualEntry/manualEntryGrid/complete")
);

const TransactionPendingApproved = lazy(() =>
  import("../pages/transactionGridManualEntry/awaitingApprovalGrid/pendingApproval")
);
const TransactionCompleteApproved = lazy(() =>
  import("../pages/transactionGridManualEntry/awaitingApprovalGrid/approved")
);

// const MDProvince = lazy(() => import("../pages/master-data/md-province"));
// const MDCity = lazy(() => import("../pages/master-data/md-city"));
const MDProduct = lazy(() => import("../pages/master-data/md-product"));
const MDSite = lazy(() => import("../pages/master-data/md-site"));
const MDStorageTank = lazy(() =>
  import("../pages/master-data/md-storage-tank")
);
const MDTransportVehicle = lazy(() =>
  import("../pages/master-data/md-transport-vehicle")
);
const MDCompany = lazy(() => import("../pages/master-data/md-company"));
const MDDriver = lazy(() => import("../pages/master-data/md-driver"));

const AdmUser = lazy(() =>
  import("../pages/administration/user-management/users")
);
const AdmUserCreate = lazy(() =>
  import("../pages/administration/user-management/users/user-create")
);
const AdmUserView = lazy(() =>
  import("../pages/administration/user-management/users/user-view")
);

const KualitasCpo = lazy(() => import("../pages/kualitas/kualitas-cpo"));
const KualitasPko = lazy(() => import("../pages/kualitas/kualitas-pko"));
const KualitasKernel = lazy(() => import("../pages/kualitas/kualitas-kernel"));

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
          <Route
            path="dashboard/labanan"
            element={<div>Dashboard Labanan</div>}
          />
          <Route path="transactions" element={<Transactions />} />
          <Route
            path="transactions/pks-edispatch-normal-in"
            element={<PksNormalIn />}
          />
          <Route
            path="transactions/pks-edispatch-normal-out"
            element={<PksNormalOut />}
          />
          <Route
            path="transactions/pks-edispatch-cancel-in"
            element={<PksCancelIn />}
          />
          <Route
            path="transactions/pks-edispatch-cancel-out"
            element={<PksCancelOut />}
          />
          <Route
            path="transactions/pks-edispatch-reject-t300-in"
            element={<PksRejectT300In />}
          />
          <Route
            path="transactions/pks-edispatch-reject-bulking-in"
            element={<PksRejectBulkingIn />}
          />
          <Route
            path="transactions/pks-edispatch-reject-out"
            element={<PksRejectOut />}
          />
          <Route
            path="transactions/pks-edispatch-normal-in/:id"
            element={<PksNormalInView />}
          />
          <Route
            path="transactions/pks-edispatch-normal-out/:id"
            element={<PksNormalOutView />}
          />
          <Route
            path="transactions/pks-edispatch-cancel-in/:id"
            element={<PksCancelInView />}
          />
          <Route
            path="transactions/pks-edispatch-cancel-out/:id"
            element={<PksCancelOutView />}
          />
          <Route
            path="transactions/pks-edispatch-reject-t300-in/:id"
            element={<PksRejectT300InView />}
          />
          <Route
            path="transactions/pks-edispatch-reject-bulking-in/:id"
            element={<PksRejectBulkingInView />}
          />
          <Route
            path="transactions/pks-edispatch-reject-out/:id"
            element={<PksRejectOutView />}
          />
          <Route path="transactions/pks-new" element={<PksEDispatchNew />} />
          <Route
            path="transactions/pks/manual-entry-in"
            name="PksManualEntryWbIn"
            element={<PksManualEntryIn />}
          />
          <Route
            path="transactions/pks/finalize-t300/:id"
            name="PksManualEntryFinalizeT300"
            element={<PksManualEntryFinalizeT300 />}
          />
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
            path="transactions/pks/manual-entry-dispatch-out/:id"
            name="PksManualEntryOutDispatch"
            element={<PksManualEntryOutDispatch />}
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
            path="transactions/pks/manual-entry-dispatch-view/:id"
            name="PksManualEntryDispatchView"
            element={<PksManualEntryDispatchView />}
          />
          <Route
            path="transactions/pks/manual-entry-dispatch-cancel-in/:id"
            name="PksManualEntryDispatchCancelIn"
            element={<PksManualEntryDispatchCancelIn />}
          />
          <Route
            path="transactions/pks/manual-entry-dispatch-cancel-in-view/:id"
            name="PksManualEntryDispatchCancelInView"
            element={<PksManualEntryDispatchCancelInView />}
          />
          <Route
            path="transactions/pks/manual-entry-dispatch-cancel-out/:id"
            name="PksManualEntryDispatchCancelOut"
            element={<PksManualEntryDispatchCancelOut />}
          />
          <Route
            path="transactions/pks/manual-entry-dispatch-cancel-out-view/:id"
            name="PksManualEntryDispatchCancelOutView"
            element={<PksManualEntryDispatchCancelOutView />}
          />
          <Route
            path="transactions/pks/dispatch-reject-t300-in/:id"
            name="PksRejectT300InManual"
            element={<PksRejectT300InManual />}
          />
          <Route
            path="transactions/pks/dispatch-reject-t300-in-view/:id"
            name="PksRejectT300InManualView"
            element={<PksRejectT300InManualView />}
          />
          <Route
            path="transactions/pks/dispatch-reject-t300-out/:id"
            name="PksRejectT300OutManual"
            element={<PksRejectT300OutManual />}
          />
          <Route
            path="transactions/pks/dispatch-reject-t300-out-view/:id"
            name="PksRejectT300OutManualView"
            element={<PksRejectT300OutManualView />}
          />

          <Route
            path="transactions-backdate-form"
            element={<TransactionsForm />}
          />

          <Route path="transactions/pks/backdate" element={<PksBackDate />} />

          <Route
            path="transactions/pks/backdate-dispatch-normal-view/:id"
            element={<PksBackDateDispatchNormalView />}
          />
          <Route
            path="transactions/pks/backdate-dispatch-reject-t300-view/:id"
            element={<PksBackDateDispatchRejectT300View />}
          />
          <Route
            path="transactions/pks/backdate-dispatch-reject-bulking-view/:id"
            element={<PksBackDateDispatchRejectBulkingView />}
          />
          <Route
            path="transactions/pks/backdate-dispatch-cancel-view/:id"
            element={<PksBackDateDispatchCancelView />}
          />
          <Route
            path="transactions/pks/backdate-tbs-view/:id"
            element={<PksBackDateTbsView />}
          />
          <Route
            path="transactions/pks/backdate-kernel-view/:id"
            element={<PksBackDateKernelView />}
          />
          <Route
            path="transactions/pks/backdate-others-view/:id"
            element={<PksBackDateOthersView />}
          />

          <Route
            path="transactions/pks/dispatch-reject-bulking-in"
            name="RejectBulkingInManual"
            element={<RejectBulkingInManual />}
          />
          <Route
            path="transactions/pks/dispatch-reject-bulking-in-view/:id"
            name="RejectBulkingInManualView"
            element={<RejectBulkingInManualView />}
          />
          <Route
            path="transactions/pks/dispatch-reject-bulking-out/:id"
            name="RejectBulkingOutManual"
            element={<RejectBulkingOutManual />}
          />
          <Route
            path="transactions/pks/dispatch-reject-bulking-out-view/:id"
            name="RejectBulkingOutManualView"
            element={<RejectBulkingOutManualView />}
          />
          <Route
            path="transactions/t30/manual-entry-in"
            name="T30ManualEntryWbIn"
            element={<T30ManualEntryIn />}
          />
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
          <Route
            path="transactions/t30/manual-entry-dispatch-cancel-in/:id"
            name="T30ManualEntryDispatchCancelIn"
            element={<T30ManualEntryDispatchCancelIn />}
          />
          <Route
            path="transactions/t30/manual-entry-dispatch-cancel-in-view/:id"
            name="T30ManualEntryDispatchCancelInView"
            element={<T30ManualEntryDispatchCancelInView />}
          />
          <Route
            path="transactions/t30/manual-entry-dispatch-cancel-out/:id"
            name="T30ManualEntryDispatchCancelOut"
            element={<T30ManualEntryDispatchCancelOut />}
          />
          <Route
            path="transactions/t30/manual-entry-dispatch-cancel-out-view/:id"
            name="T30ManualEntryDispatchCancelOutView"
            element={<T30ManualEntryDispatchCancelOutView />}
          />

          <Route path="transactions/t30/backdate" element={<T30BackDate />} />

          <Route
            path="transactions/t30/backdate-dispatch-normal-view/:id"
            element={<T30BackDateDispatchNormalView />}
          />
          <Route
            path="transactions/t30/backdate-dispatch-cancel-view/:id"
            element={<T30BackDateDispatchCancelView />}
          />
          <Route
            path="transactions/t30/backdate-others-view/:id"
            element={<T30BackDateOthersView />}
          />

          <Route
            path="transactions/t30-edispatch-normal-in"
            element={<T30NormalIn />}
          />
          <Route
            path="transactions/t30-edispatch-normal-out"
            element={<T30NormalOut />}
          />
          <Route
            path="transactions/t30-edispatch-cancel-in"
            element={<T30CancelIn />}
          />
          <Route
            path="transactions/t30-edispatch-cancel-out"
            element={<T30CancelOut />}
          />
          <Route
            path="transactions/t30-edispatch-normal-in/:id"
            element={<T30NormalInView />}
          />
          <Route
            path="transactions/t30-edispatch-normal-out/:id"
            element={<T30NormalOutView />}
          />
          <Route
            path="transactions/t30-edispatch-cancel-in/:id"
            element={<T30CancelInView />}
          />
          <Route
            path="transactions/t30-edispatch-cancel-out/:id"
            element={<T30CancelOutView />}
          />
          <Route
            path="transactions/t30-edispatch-deleted/:id"
            element={<T30DeletedView />}
          />
          <Route
            path="transactions/bulking/manual-entry-in"
            element={<BulkingManualEntryIn />}
          />
          <Route
            path="transactions/bulking/manual-entry-in-qr"
            element={<BulkingManualEntryInQR />}
          />
          <Route
            path="transactions/bulking/manual-entry-dispatch-out/:id"
            name="BulkingManualEntryDispatchOut"
            element={<BulkingManualEntryDispatchOut />}
          />
          <Route
            path="transactions/bulking/manual-entry-others-out/:id"
            name="BulkingManualEntryOutOthers"
            element={<BulkingManualEntryOutOthers />}
          />
          <Route
            path="transactions/bulking/manual-entry-dispatch-view/:id"
            name="BulkingManualEntryDispatchView"
            element={<BulkingManualEntryDispatchView />}
          />
          <Route
            path="transactions/bulking/manual-entry-others-view/:id"
            name="BulkingManualEntryOthersView"
            element={<BulkingManualEntryOthersView />}
          />
          <Route
            path="transactions/bulking-edispatch-in"
            element={<BulkingIn />}
          />
          <Route
            path="transactions/bulking-edispatch-out"
            element={<BulkingOut />}
          />
          <Route
            path="transactions/bulking-edispatch-in/:id"
            element={<BulkingViewIn />}
          />
          <Route
            path="transactions/bulking-edispatch-out/:id"
            element={<BulkingViewOut />}
          />

          <Route
            path="transactions/bulking/backdate"
            element={<BulkingBackDate />}
          />

          <Route
            path="transactions/bulking/backdate-dispatch-view/:id"
            element={<BulkingBackDateDispatchView />}
          />
          <Route
            path="transactions/bulking/backdate-others-view/:id"
            element={<BulkingBackDateOthersView />}
          />

          <Route
            path="reports/transactions-daily"
            element={<ReportTransactionDaily />}
          />

          <Route
            path="transactions-manual-pending"
            element={<TransactionOnGoing />}
          />
          <Route
            path="transactions-manual-complete"
            element={<TransactionComplete />}
          />
          <Route
            path="approve/transactions-manual-pending"
            element={<TransactionPendingApproved />}
          />
          <Route
            path="approve/transactions-manual-complete"
            element={<TransactionCompleteApproved />}
          />
          {/* <Route path="md/provinces" element={<MDProvince />} />
          <Route path="md/cities" element={<MDCity />} /> */}
          <Route path="md/products" element={<MDProduct />} />
          <Route path="md/sites" element={<MDSite />} />
          <Route path="md/storage-tanks" element={<MDStorageTank />} />
          <Route
            path="md/transport-vehicles"
            element={<MDTransportVehicle />}
          />
          <Route path="md/companies" element={<MDCompany />} />
          <Route path="md/drivers" element={<MDDriver />} />
          <Route path="kualitas/pko" element={<KualitasPko />} />
          <Route path="kualitas/cpo" element={<KualitasCpo />} />
          <Route path="kualitas/kernel" element={<KualitasKernel />} />
          <Route path="administration/configs/:id" element={<Config />} />
          <Route path="administration/users" element={<AdmUser />} />
          <Route path="administration/users/add" element={<AdmUserCreate />} />
          <Route path="administration/users/:id" element={<AdmUserView />} />
          <Route
            path="*"
            name="Page 404"
            element={<div>Page 404 Transaksi WB</div>}
          />
        </Route>
      </Route>

      <Route path="*" name="Page 404" element={<div>Page 404 Public</div>} />
    </Routes>
  );
};

export default routes;
