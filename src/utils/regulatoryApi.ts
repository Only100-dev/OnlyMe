import { Regulation } from '../types/compliance';

const UAE_CENTRAL_BANK_API = 'https://rulebook.centralbank.ae/api';

export async function fetchRegulations(): Promise<Regulation[]> {
  // Simulated API call to UAE Central Bank
  return [
    {
      id: 'reg-001',
      title: 'Mandatory Third Party Liability',
      description: 'Minimum coverage requirements for third party liability insurance',
      category: 'coverage',
      requirements: [
        'Minimum coverage of AED 250,000 for property damage',
        'Unlimited coverage for bodily injury or death',
        'Coverage must extend to all GCC countries'
      ],
      lastUpdated: new Date('2024-01-01'),
      source: 'UAE Insurance Authority'
    },
    {
      id: 'reg-002',
      title: 'Driver Age Requirements',
      description: 'Age restrictions and requirements for motor insurance coverage',
      category: 'general',
      requirements: [
        'Minimum driver age of 18 years',
        'Additional premium for drivers under 25 years',
        'Special requirements for commercial vehicle drivers'
      ],
      lastUpdated: new Date('2024-01-01'),
      source: 'UAE Insurance Authority'
    }
  ];
}

export async function validateRegulation(regulationId: string): Promise<boolean> {
  // Simulated validation against UAE Central Bank rules
  return true;
}

export async function checkComplianceRequirements(category: string): Promise<string[]> {
  // Simulated compliance requirements check
  const requirements: Record<string, string[]> = {
    coverage: [
      'Minimum third party liability coverage',
      'Personal accident coverage',
      'Property damage coverage'
    ],
    documentation: [
      'Valid UAE driving license',
      'Vehicle registration card',
      'Emirates ID'
    ],
    claims: [
      'Claims history report',
      'Police report for accidents',
      'Medical reports for injuries'
    ]
  };

  return requirements[category] || [];
}