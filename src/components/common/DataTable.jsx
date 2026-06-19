import clsx from 'clsx'
import PaginationBar from './PaginationBar'

const DataTable = ({
  columns,
  rows,
  page,
  pageSize,
  total,
  onPageChange,
  emptyMessage = 'No records found.',
}) => (
  <div className="glass-panel overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100/80 bg-white/40 backdrop-blur-sm">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider',
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/70">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row.id ?? i} className="hover:bg-white/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={clsx('px-4 py-3.5 text-slate-700', col.className)}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {total != null && page != null && (
      <div className="px-4 pb-4">
        <PaginationBar page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
      </div>
    )}
  </div>
)

export default DataTable
