import type { Config, Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { getUser } from '@netlify/identity'

const STORE_NAME = 'site-content'
const KEY = 'content'

// Used only the first time the site loads, before an admin has saved anything yet.
const seedContent = {
  business: {
    name: 'McAndrews Garden Oasis',
    tagline: 'Tile Installation',
    phone: '267-469-7346',
    phoneHref: '12674697346',
    email: 'christianmcandrewszg@yahoo.com',
    logo: '/images/logo.png',
  },
  hero: {
    eyebrow: 'M C A N D R E W S   G A R D E N   O A S I S',
    heading: 'Tile work that makes your space feel finished.',
    copy: 'Professional tile installation and repair for bathrooms, kitchens, showers, floors and more. Clean work. Careful details. Built to look right.',
    trust: ['Residential tile work', 'Repairs & replacements', 'Detailed finish work'],
  },
  intro: {
    kicker: 'TILE INSTALLATIONS',
    heading: 'From one replacement tile to a complete room.',
    body: "Whether you're refreshing a small bathroom, replacing a damaged section, or transforming a kitchen floor, McAndrews Garden Oasis provides focused tile installation and repair with attention to layout, cuts, grout lines and the finished look.",
  },
  servicesIntro: {
    kicker: 'WHAT WE DO',
    heading: 'Tile & flooring services for the spaces you use every day.',
    note: 'Tile, LVP and repair work. Have something different in mind? Choose "Other" on the quote form and tell us what you need.',
  },
  services: [
    { title: 'Bathroom Tile', description: 'Bathroom floors, walls and complete tile installations.', image: '/images/uploads/project-01.jpg' },
    { title: 'Kitchen Tile', description: 'Kitchen floors, backsplashes and detailed tile layouts.', image: '/images/uploads/project-03.jpg' },
    { title: 'Shower Tile', description: 'Shower walls, niches, waterproofing-ready surfaces and finish tile.', image: '/images/uploads/project-02.jpg' },
    { title: 'Floor Tile', description: 'Clean layouts, straight lines, transitions and finished grout work.', image: '/images/uploads/project-04.jpg' },
    { title: 'Backsplashes', description: 'Accent walls and backsplash installations with careful cuts and alignment.', image: '/images/uploads/project-06.jpg' },
    { title: 'LVP Flooring', description: 'Professional LVP flooring installation for kitchens, living spaces and more.', image: '/images/uploads/project-07.jpg' },
    { title: 'Tile Repair', description: 'Replacement tiles, regrouting, damaged areas and detail repairs.', image: '/images/uploads/project-05.jpg' },
  ],
  workIntro: {
    kicker: 'OUR WORK',
    heading: 'Real projects by McAndrews Garden Oasis.',
    note: 'These are photos from our own tile installation projects. Tap any photo to view it larger.',
  },
  projects: [
    { title: 'Project preparation & layout', category: 'Tile Installation', image: '/images/uploads/project-01.jpg', video: '' },
    { title: 'Bathroom floor tile installation', category: 'Tile Installation', image: '/images/uploads/project-02.jpg', video: '' },
    { title: 'Floor tile installation', category: 'Tile Installation', image: '/images/uploads/project-03.jpg', video: '' },
    { title: 'Shower tile & niche', category: 'Tile Installation', image: '/images/uploads/project-04.jpg', video: '' },
    { title: 'Accent / feature tile', category: 'Tile Installation', image: '/images/uploads/project-05.jpg', video: '' },
    { title: 'Floor tile layout & leveling', category: 'Tile Installation', image: '/images/uploads/project-06.jpg', video: '' },
    { title: 'Finished floor tile', category: 'Tile Installation', image: '/images/uploads/project-07.jpg', video: '' },
    { title: 'Completed tile project', category: 'Tile Installation', image: '/images/uploads/project-08.jpg', video: '' },
    { title: 'Marble-look shower installation', category: 'Tile Installation', image: '/images/uploads/project-09.jpg', video: '' },
    { title: 'Completed bathroom tile project', category: 'Tile Installation', image: '/images/uploads/project-10.jpg', video: '' },
    { title: 'Large-format floor tile layout', category: 'Tile Installation', image: '/images/uploads/project-11.jpg', video: '' },
    { title: 'Floor preparation & installation', category: 'Tile Installation', image: '/images/uploads/project-12.jpg', video: '' },
    { title: 'Small-format shower tile', category: 'Tile Installation', image: '/images/uploads/project-13.jpg', video: '' },
    { title: 'Finished shower tile', category: 'Tile Installation', image: '/images/uploads/project-14.jpg', video: '' },
  ],
  about: {
    kicker: 'ABOUT MCANDREWS GARDEN OASIS',
    heading: 'A tile installation business focused on the finished result.',
    body: 'McAndrews Garden Oasis specializes in tile installation and tile repair. From smaller detail work to larger kitchen and bathroom projects, the focus is straightforward: understand the job, install the tile carefully, and leave you with a finished space that looks put together.',
    tags: ['Tile installations', 'Tile repairs', 'Bathroom & kitchen work', 'Quote requests by email'],
  },
  videoIntro: {
    kicker: 'PROJECT VIDEOS',
    heading: 'See the work in progress and the finished result.',
    note: 'New videos can be added from the admin dashboard without changing the website code.',
  },
  sections: [],
}

export default async (req: Request, context: Context) => {
  const store = getStore(STORE_NAME)

  if (req.method === 'GET') {
    const data = await store.get(KEY, { type: 'json' })
    return Response.json(data ?? seedContent)
  }

  if (req.method === 'PUT') {
    const user = await getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return new Response('Invalid JSON', { status: 400 })
    }
    if (!body || typeof body !== 'object') return new Response('Invalid content', { status: 400 })

    await store.setJSON(KEY, body)
    return Response.json({ ok: true })
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = {
  path: '/api/content',
}
