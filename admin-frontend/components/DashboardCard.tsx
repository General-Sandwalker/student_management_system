import Link from 'next/link'

export default function DashboardCard({
  title,
  value,
  icon,
  link,
  color
}: {
  title: string
  value: number
  icon: string
  link: string
  color: string
}) {
  return (
    <Link href={link}>
      <div className={`bg-${color}-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className={`text-3xl font-bold mt-2 text-${color}-800`}>{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </Link>
  )
}

