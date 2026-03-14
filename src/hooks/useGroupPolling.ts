"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { sorosaveClient } from "@/lib/sorosave";
import { GroupStatus } from "@sorosave/sdk";

const POLL_INTERVAL = 10_000;

export interface GroupData {
  id: number;
  name: string;
  admin: string;
  token: string;
  contributionAmount: bigint;
  cycleLength: number;
  maxMembers: number;
  members: string[];
  payoutOrder: string[];
  currentRound: number;
  totalRounds: number;
  status: GroupStatus;
  createdAt: number;
  contributionsReceived: number;
}

interface UseGroupPollingResult {
  group: GroupData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isPolling: boolean;
  refresh: () => Promise<void>;
}

export function useGroupPolling(groupId: string): UseGroupPollingResult {
  const [group, setGroup] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const fetchGroupData = useCallback(async () => {
    try {
      const data = await sorosaveClient.getGroup(Number(groupId));
      if (!mountedRef.current) return;
      setGroup(data as GroupData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : "Failed to fetch group data");
    }
  }, [groupId]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchGroupData();
    setIsLoading(false);
  }, [fetchGroupData]);

  // Initial fetch + cleanup
  useEffect(() => {
    mountedRef.current = true;
    setIsLoading(true);
    fetchGroupData().finally(() => {
      if (mountedRef.current) setIsLoading(false);
    });
    return () => { mountedRef.current = false; };
  }, [fetchGroupData]);

  // Polling lifecycle: active/forming = poll, completed/failed = stop
  useEffect(() => {
    if (!group) return;
    const shouldPoll = group.status === GroupStatus.Active || group.status === GroupStatus.Forming;
    if (!shouldPoll) {
      setIsPolling(false);
      return;
    }
    setIsPolling(true);
    intervalRef.current = setInterval(fetchGroupData, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [group?.status, group?.currentRound, fetchGroupData]);

  return { group, isLoading, error, lastUpdated, isPolling, refresh };
}
