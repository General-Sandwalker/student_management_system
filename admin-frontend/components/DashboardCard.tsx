import Link from 'next/link'

type CardColor = 'purple' | 'blue' | 'green' | 'red' | 'indigo' | 'yellow'

interface DashboardCardProps {
  title: string
  value: number
  icon: string
  link: string
  color: CardColor
}

const colorClasses = {
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    hover: 'hover:bg-purple-50'
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-50'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    hover: 'hover:bg-green-50'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    hover: 'hover:bg-red-50'
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    hover: 'hover:bg-indigo-50'
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    hover: 'hover:bg-yellow-50'
  }
}

export default function DashboardCard({
  title,
  value,
  icon,
  link,
  color
}: DashboardCardProps) {
  const colors = colorClasses[color] || colorClasses.purple

  return (
    <Link href={link} passHref>
      <div className={`${colors.bg} ${colors.hover} p-6 rounded-lg shadow hover:shadow-md transition-all duration-200 cursor-pointer h-full`}>
        <div className="flex justify-between items-start h-full">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className={`${colors.text} text-3xl font-bold mt-2`}>{value}</p>
          </div>
          <span className="text-3xl opacity-80">{icon}</span>
        </div>
      </div>
    </Link>
  )
}
