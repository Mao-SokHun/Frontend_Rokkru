import { Tags, MapPin } from 'lucide-react'
import { PageScaffold, PageCard, StatMetric, TabBar, DataTable } from '@/components'
import EmptyState from '../../components/ui/EmptyState'
import { usePlatformCatalog } from '@/hooks'
import { useTranslation } from '@/i18n'

const PlatformCatalog = () => {
  const { t, lang } = useTranslation()
  const {
    activeTab,
    setActiveTab,
    catalog,
    loading,
    skillRows,
    provinceRows,
    subSkillTotal,
  } = usePlatformCatalog(lang)

  const skillColumns = [
    { key: 'major', label: t('adminCatalog.colMajor') },
    { key: 'subject', label: t('adminCatalog.colSubject') },
  ]

  const provinceColumns = [
    { key: 'name', label: t('adminCatalog.colProvince') },
    { key: 'code', label: t('adminCatalog.colCode'), render: (row) => (
      <span className="font-mono text-xs text-slate-500">{row.code}</span>
    ) },
  ]

  return (
    <PageScaffold
      title={t('admin.catalog')}
      subtitle={t('adminCatalog.subtitle')}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatMetric
          label={t('adminCatalog.majors')}
          value={loading ? '…' : String(catalog.skills.length)}
          icon={Tags}
          tone="primary"
        />
        <StatMetric
          label={t('adminCatalog.subjects')}
          value={loading ? '…' : String(subSkillTotal)}
          tone="success"
        />
        <StatMetric
          label={t('adminCatalog.provinces')}
          value={loading ? '…' : String(catalog.provinces.length)}
          icon={MapPin}
          tone="warning"
        />
      </div>

      <TabBar
        tabs={[
          { id: 'skills', label: t('adminCatalog.tabSkills') },
          { id: 'provinces', label: t('adminCatalog.tabProvinces') },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <PageCard padding={false}>
        {loading ? (
          <EmptyState size="sm" title={t('adminCatalog.loading')} className="py-12" />
        ) : activeTab === 'skills' ? (
          <DataTable
            columns={skillColumns}
            rows={skillRows}
            emptyMessage={t('adminCatalog.emptySkills')}
          />
        ) : (
          <DataTable
            columns={provinceColumns}
            rows={provinceRows}
            emptyMessage={t('adminCatalog.emptyProvinces')}
          />
        )}
      </PageCard>

      <p className="text-xs text-slate-400">{t('adminCatalog.readOnlyHint')}</p>
    </PageScaffold>
  )
}

export default PlatformCatalog
