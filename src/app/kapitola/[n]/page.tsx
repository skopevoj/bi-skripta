import { notFound, redirect } from 'next/navigation'
import { chapterByNum, chapters } from '@/lib/content'

export function generateStaticParams() {
  return chapters.map((c) => ({ n: c.number }))
}

export default async function ChapterIndex({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params
  if (!chapterByNum(n)) notFound()
  redirect(`/kapitola/${n}/1`)
}
