import { Regulation } from '../types/compliance';
import { useComplianceStore } from '../store/useComplianceStore';
import { fetchRegulations } from './regulatoryApi';

interface SyncResult {
  updated: number;
  failed: number;
  logs: string[];
  newRegulations: string[];
  modifiedRegulations: string[];
}

export async function syncRegulations(): Promise<SyncResult> {
  const result: SyncResult = {
    updated: 0,
    failed: 0,
    logs: [],
    newRegulations: [],
    modifiedRegulations: [],
  };

  try {
    const remoteRegulations = await fetchRegulations();
    const store = useComplianceStore.getState();
    const localRegulations = store.regulations;

    for (const regulation of remoteRegulations) {
      try {
        const localRegulation = localRegulations.find(r => r.id === regulation.id);

        if (!localRegulation) {
          // New regulation
          store.addRegulation(regulation);
          result.updated++;
          result.newRegulations.push(regulation.title);
          result.logs.push(`Added new regulation: ${regulation.title}`);
        } else {
          // Check for updates
          const changes = compareRegulations(localRegulation, regulation);
          if (changes.changed) {
            store.updateRegulation(regulation.id, regulation);
            result.updated++;
            result.modifiedRegulations.push(regulation.title);
            result.logs.push(
              `Updated regulation: ${regulation.title}\nChanges: ${changes.differences.join(', ')}`
            );
          }
        }
      } catch (error) {
        result.failed++;
        result.logs.push(`Failed to process regulation: ${regulation.title}`);
      }
    }

    // Check for removed regulations
    const removedRegulations = localRegulations.filter(
      local => !remoteRegulations.some(remote => remote.id === local.id)
    );

    if (removedRegulations.length > 0) {
      result.logs.push('Removed outdated regulations:');
      removedRegulations.forEach(regulation => {
        result.logs.push(`- ${regulation.title}`);
      });
    }

  } catch (error) {
    result.failed++;
    result.logs.push('Failed to fetch regulations from UAE Insurance Authority');
  }

  return result;
}

function compareRegulations(
  local: Regulation,
  remote: Regulation
): { changed: boolean; differences: string[] } {
  const differences: string[] = [];

  // Compare basic properties
  if (local.title !== remote.title) differences.push('Title updated');
  if (local.description !== remote.description) differences.push('Description modified');
  if (local.category !== remote.category) differences.push('Category changed');
  if (local.source !== remote.source) differences.push('Source updated');

  // Compare requirements
  const localReqs = new Set(local.requirements);
  const remoteReqs = new Set(remote.requirements);

  remote.requirements.forEach(req => {
    if (!localReqs.has(req)) differences.push(`Added requirement: ${req}`);
  });

  local.requirements.forEach(req => {
    if (!remoteReqs.has(req)) differences.push(`Removed requirement: ${req}`);
  });

  return {
    changed: differences.length > 0,
    differences
  };
}