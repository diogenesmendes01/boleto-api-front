import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ApiConfig from "./pages/ApiConfig";
import UploadNew from "./pages/UploadNew";
import Boletos from "./pages/Boletos";
import UploadDetails from "./pages/UploadDetails";
import BoletoDetails from "./pages/BoletoDetails";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EmailVerification from "./pages/EmailVerification";
import EmailVerify from "./pages/EmailVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ImportStatus from "./pages/ImportStatus";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/cadastro"} component={Cadastro} />
      <Route path={"/email-verification"} component={EmailVerification} />
      <Route path={"/email-verify"} component={EmailVerify} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/config"} component={ApiConfig} />
      <Route path={"/upload"} component={UploadNew} />
      <Route path={"/boletos"} component={Boletos} />
      <Route path={"/upload/:id"} component={UploadDetails} />
      <Route path={"/boleto/:id"} component={BoletoDetails} />
      <Route path={"/import/:id"} component={ImportStatus} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
