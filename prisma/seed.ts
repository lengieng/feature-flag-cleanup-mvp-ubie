import { PrismaClient, FlagStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.cleanupJob.deleteMany();
  await prisma.flag.deleteMany();

  console.log('✨ Cleared existing data');

  // Calculate dates relative to today
  const today = new Date();
  const daysAgo = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date;
  };

  // Create mock flags with different scenarios
  const flags = [
    {
      key: 'patient_data_insights',
      name: 'Patient Data Insights',
      description: 'Patient data insights dashboard',
      createdAt: daysAgo(90), // 90 days old
      createdBy: 'lengieng',
      rolloutPercent: 100,
      lastEvaluatedAt: daysAgo(47), // Not evaluated in 47 days - EXPIRED
      status: FlagStatus.ACTIVE,
    },
    {
      key: 'beta_ai_assisted_decision_support',
      name: 'Beta AI-assisted Decision Support',
      description: 'AI-assisted decision integration',
      createdAt: daysAgo(365), // Very old
      createdBy: 'charlie',
      rolloutPercent: 100,
      lastEvaluatedAt: daysAgo(120), // Not evaluated in 120 days - VERY EXPIRED
      status: FlagStatus.ACTIVE,
    },
    {
      key: 'dark_mode',
      name: 'Dark Mode',
      description: 'Dark theme for the application',
      createdAt: daysAgo(30),
      createdBy: 'alice',
      rolloutPercent: 100,
      lastEvaluatedAt: daysAgo(2), // Recently evaluated - ACTIVE
      status: FlagStatus.ACTIVE,
    },
    {
      key: 'doctors_note',
      name: "Doctor's note",
      description: 'Doctors Note feature',
      createdAt: daysAgo(15),
      createdBy: 'bob',
      rolloutPercent: 50, // Still rolling out - ACTIVE
      lastEvaluatedAt: today, // Active now
      status: FlagStatus.ACTIVE,
    },
    {
      key: 'new_dashboard_layout',
      name: 'New Dashboard Layout',
      description: 'Redesigned dashboard with widgets',
      createdAt: daysAgo(60),
      createdBy: 'diana',
      rolloutPercent: 100,
      lastEvaluatedAt: daysAgo(35), // Slightly over 30 days - EXPIRED
      status: FlagStatus.ACTIVE,
    },
  ];

  for (const flag of flags) {
    await prisma.flag.create({ data: flag });
    console.log(`  ✅ Created flag: ${flag.key}`);
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log(`📊 Created ${flags.length} flags`);
  console.log('\n💡 Expected scan results:');
  console.log('   - Expired flags (>30 days, 100% rollout, no recent eval): 3');
  console.log('   - Active flags: 2');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
