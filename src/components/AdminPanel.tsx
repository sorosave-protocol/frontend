import { useState } from 'react';
import { useWallet } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AdminPanelProps {
  groupId: string;
  isAdmin: boolean;
  groupStatus: 'Forming' | 'Active' | 'Paused';
}

export function AdminPanel({ groupId, isAdmin, groupStatus }: AdminPanelProps) {
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const { address } = useWallet();

  if (!isAdmin) return null;

  const handleStartGroup = async () => {
    // Implementation for starting group
  };

  const handleTogglePause = async () => {
    // Implementation for pause/resume
  };

  const handleTransferAdmin = async () => {
    // Implementation for transferring admin
  };

  const handleEmergencyWithdraw = async () => {
    // Implementation for emergency withdraw
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Admin Controls</h3>

      {groupStatus === 'Forming' && (
        <Button onClick={handleStartGroup} className="mb-4">
          Start Group
        </Button>
      )}

      {(groupStatus === 'Active' || groupStatus === 'Paused') && (
        <div className="flex items-center space-x-4 mb-4">
          <Button onClick={handleTogglePause} variant={groupStatus === 'Paused' ? 'default' : 'destructive'}>          {groupStatus === 'Paused' ? 'Resume' : 'Pause'} Group
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transfer Admin
          </label>
          <div className="flex space-x-2">
            <Input
              placeholder="New admin address"
              value={newAdminAddress}
              onChange={(e) => setNewAdminAddress(e.target.value)}
            />
            <Button onClick={handleTransferAdmin}>Transfer</Button>
          </div>
        </div>

        <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive">Emergency Withdraw</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emergency Withdraw</DialogTitle>
              <DialogDescription>
                This will immediately withdraw all funds from the group. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleEmergencyWithdraw}>
                Confirm Withdraw
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}