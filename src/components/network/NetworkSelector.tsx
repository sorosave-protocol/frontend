'use client';

import { useNetwork } from '@/contexts/NetworkContext';
import { NETWORKS, NetworkType } from '@/lib/network';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Globe } from 'lucide-react';

export function NetworkSelector() {
  const { network, config, switchNetwork } = useNetwork();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className={network === 'mainnet' ? 'text-green-600' : 'text-yellow-600'}>
            {config.name}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(NETWORKS) as NetworkType[]).map((net) => (
          <DropdownMenuItem
            key={net}
            onClick={() => switchNetwork(net)}
            className={network === net ? 'bg-accent' : ''}
          >
            <span className={net === 'mainnet' ? 'text-green-600' : 'text-yellow-600'}>
              {NETWORKS[net].name}
            </span>
            {network === net && <span className="ml-2 text-xs text-muted-foreground">(current)</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
