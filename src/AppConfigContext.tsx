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

  // Flag to debounce alerts & fetches
  let updateTimeout: NodeJS.Timeout | null = null;

  // Fetch configs without Alert (use showNotice flag)
  const fetchConfigs = async (showNotice = false) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.from("app_config").select("*");

      if (error) {
        console.error("❌ Failed to fetch configs:", error.message);
        setConfigs({});
      } else if (data) {
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
    } catch (error) {
      console.error("❌ Unexpected error fetching configs:", error);
      setConfigs({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchConfigs();

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
            // Debounce the fetch to avoid multiple calls in quick succession
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
              fetchConfigs(true);
            }, 1000);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (updateTimeout) clearTimeout(updateTimeout);
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <AppConfigContext.Provider value={{ configs, loading }}>
      {children}
    </AppConfigContext.Provider>
  );
}
