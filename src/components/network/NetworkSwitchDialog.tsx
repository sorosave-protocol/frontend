'use client';

import { useNetwork } from '@/contexts/NetworkContext';
import { NETWORKS } from '@/lib/network';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function NetworkSwitchDialog() {
  const { showConfirmDialog, pendingNetwork, confirmSwitch, cancelSwitch } = useNetwork();

  if (!pendingNetwork) return null;

  return (
    <Dialog open={showConfirmDialog} onOpenChange={cancelSwitch}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Switch Network?
          </DialogTitle>
          <DialogDescription>
            You are about to switch to <strong>{NETWORKS[pendingNetwork].name}</strong>.
            <br /><br />
            This will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Clear all cached data</li>
              <li>Disconnect current wallet session</li>
              <li>Reload the application</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={cancelSwitch}>
            Cancel
          </Button>
          <Button onClick={confirmSwitch} variant="default">
            Switch to {NETWORKS[pendingNetwork].name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
