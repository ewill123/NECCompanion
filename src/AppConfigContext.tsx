import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";
import { supabase } from "./services/supabaseClient";

export interface AppConfigs {
  [key: string]: string;
}

interface AppConfigContextType {
  configs: AppConfigs;
  loading: boolean;
}

export const AppConfigContext = createContext<AppConfigContextType>({
  configs: {},
  loading: true,
});

interface Props {
  children: ReactNode;
}

export function AppConfigProvider({ children }: Props) {
  const [configs, setConfigs] = useState<AppConfigs>({});
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch all configs
  const fetchConfigs = async (showNotice = false) => {
    console.log("🔄 Fetching app configs...");
    setLoading(true);

    const { data, error } = await supabase.from("app_config").select("*");

    if (error) {
      console.error("❌ Failed to fetch configs:", error.message);
      setConfigs({});
    } else {
      const configObj: AppConfigs = {};
      data.forEach(({ key, value }: { key: string; value: string }) => {
        configObj[key] = value;
      });
      setConfigs(configObj);

      if (showNotice) {
        Alert.alert("App Updated", "The latest settings have been applied.");
      }

      console.log("✅ App configs updated:", configObj);
    }

    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    // Initial fetch
    fetchConfigs();

    // Real-time listener
    const subscription = supabase
      .channel("public:app_config")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_config" },
        (payload) => {
          if (!isMounted) return;
          const { eventType, new: newRow, old: oldRow } = payload as any;

          console.log("🛰️ Realtime event:", eventType, newRow || oldRow);

          if (eventType === "DELETE" && oldRow?.key) {
            setConfigs((prev) => {
              const updated = { ...prev };
              delete updated[oldRow.key];
              return updated;
            });
          } else if (
            (eventType === "INSERT" || eventType === "UPDATE") &&
            newRow?.key
          ) {
            fetchConfigs(true); // Show alert on update
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <AppConfigContext.Provider value={{ configs, loading }}>
      {children}
    </AppConfigContext.Provider>
  );
}
