import { useState } from 'react'
import { Mail, Lock, Search, Send, Trash2, Heart } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardImage, CardContent, CardFooter, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Avatar } from '../components/ui/Avatar'
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton'
import { Modal } from '../components/ui/Modal'
import { Select } from '../components/ui/Select'
import { FilePicker } from '../components/ui/FilePicker'

export default function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const selectOptions = [
    { value: 'rpg', label: 'RPG' },
    { value: 'action', label: 'Action' },
    { value: 'aventure', label: 'Aventure' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Composants UI - GameFund
          </h1>
          <p className="text-gray-600">
            Démonstration de tous les composants du design system
          </p>
        </div>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Buttons</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Tailles</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">États</p>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading...</Button>
                  <Button disabled>Disabled</Button>
                  <Button variant="primary">
                    <Send size={18} />
                    Avec icône
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover>
              <CardImage
                src="https://picsum.photos/seed/game1/800/400"
                alt="Projet de jeu"
              />
              <CardContent>
                <CardTitle>Mystic Quest</CardTitle>
                <CardDescription>
                  Un RPG épique mêlant magie et technologie
                </CardDescription>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>👥 234 donateurs</span>
                  <span>⏱ 12 jours</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardContent>
                <CardTitle>Card sans image</CardTitle>
                <CardDescription>
                  Une carte simple sans image mais avec du contenu
                </CardDescription>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent>
                <CardTitle>Card avec hover</CardTitle>
                <CardDescription>
                  Passez la souris pour voir l'effet
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Badges</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Variants sémantiques</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Statuts de projets</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="draft">Brouillon</Badge>
                  <Badge variant="active">Actif</Badge>
                  <Badge variant="completed">Terminé</Badge>
                  <Badge variant="failed">Échoué</Badge>
                  <Badge variant="cancelled">Annulé</Badge>
                  <Badge variant="suspended">Suspendu</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Tailles</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm" variant="primary">Small</Badge>
                  <Badge size="md" variant="primary">Medium</Badge>
                  <Badge size="lg" variant="primary">Large</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Form Elements</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                placeholder="exemple@email.com"
                icon={Mail}
              />

              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                required
              />

              <Input
                label="Recherche"
                type="text"
                placeholder="Rechercher un projet..."
                icon={Search}
              />

              <Input
                label="Avec erreur"
                type="text"
                defaultValue="Valeur incorrecte"
                error="Ce champ contient une erreur"
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  placeholder="Décrivez votre projet..."
                  maxLength={500}
                  showCount
                  rows={4}
                />
              </div>

              <Select
                label="Catégorie du jeu"
                options={selectOptions}
                placeholder="Choisir une catégorie"
                required
              />

              <Select
                label="Avec erreur"
                options={selectOptions}
                error="Veuillez sélectionner une option"
              />

              <div className="md:col-span-2">
                <FilePicker
                  label="Image du projet"
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                  onFileSelect={(file) => {
                    setSelectedFile(file)
                    console.log('Fichier sélectionné:', file)
                  }}
                  onFileRemove={() => {
                    setSelectedFile(null)
                    console.log('Fichier supprimé')
                  }}
                  helperText="PNG, JPG ou GIF jusqu'à 5MB"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bars */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Progress Bars</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <ProgressBar value={65} max={100} />
              <ProgressBar value={80} max={100} animated />
              <ProgressBar value={45} max={100} variant="success" />
              <ProgressBar value={30} max={100} variant="warning" />
              <ProgressBar value={20} max={100} variant="error" />
              <ProgressBar value={32500} max={50000} showLabel={false} />
            </div>
          </div>
        </section>

        {/* Avatars */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Avatars</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Avec image</p>
                <div className="flex items-center gap-3">
                  <Avatar src="https://i.pravatar.cc/150?img=1" size="xs" />
                  <Avatar src="https://i.pravatar.cc/150?img=2" size="sm" />
                  <Avatar src="https://i.pravatar.cc/150?img=3" size="md" />
                  <Avatar src="https://i.pravatar.cc/150?img=4" size="lg" />
                  <Avatar src="https://i.pravatar.cc/150?img=5" size="xl" />
                  <Avatar src="https://i.pravatar.cc/150?img=6" size="2xl" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Sans image (fallback)</p>
                <div className="flex items-center gap-3">
                  <Avatar size="md" />
                  <Avatar size="md" fallback="PB" />
                  <Avatar size="md" fallback="AJ" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Groupe d'avatars</p>
                <div className="flex -space-x-2">
                  <Avatar src="https://i.pravatar.cc/150?img=10" size="sm" className="ring-2 ring-white" />
                  <Avatar src="https://i.pravatar.cc/150?img=11" size="sm" className="ring-2 ring-white" />
                  <Avatar src="https://i.pravatar.cc/150?img=12" size="sm" className="ring-2 ring-white" />
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                    +5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skeletons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Skeletons (Loading)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <Skeleton className="w-12 h-12 rounded-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </section>

        {/* Modal */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Modal</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <Button onClick={() => setIsModalOpen(true)}>
              Ouvrir la modal
            </Button>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Confirmation d'action"
              footer={
                <>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button variant="danger" onClick={() => setIsModalOpen(false)}>
                    <Trash2 size={18} />
                    Supprimer
                  </Button>
                </>
              }
            >
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible
                et toutes les données associées seront définitivement perdues.
              </p>
            </Modal>
          </div>
        </section>

        {/* Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Palette de couleurs</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Primary (Purple)</p>
                <div className="grid grid-cols-10 gap-2">
                  <div className="h-12 bg-primary-50 rounded flex items-center justify-center text-xs">50</div>
                  <div className="h-12 bg-primary-100 rounded flex items-center justify-center text-xs">100</div>
                  <div className="h-12 bg-primary-200 rounded flex items-center justify-center text-xs">200</div>
                  <div className="h-12 bg-primary-300 rounded flex items-center justify-center text-xs">300</div>
                  <div className="h-12 bg-primary-400 rounded flex items-center justify-center text-xs text-white">400</div>
                  <div className="h-12 bg-primary-500 rounded flex items-center justify-center text-xs text-white">500</div>
                  <div className="h-12 bg-primary-600 rounded flex items-center justify-center text-xs text-white">600</div>
                  <div className="h-12 bg-primary-700 rounded flex items-center justify-center text-xs text-white">700</div>
                  <div className="h-12 bg-primary-800 rounded flex items-center justify-center text-xs text-white">800</div>
                  <div className="h-12 bg-primary-900 rounded flex items-center justify-center text-xs text-white">900</div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Accent (Green)</p>
                <div className="grid grid-cols-10 gap-2">
                  <div className="h-12 bg-accent-50 rounded flex items-center justify-center text-xs">50</div>
                  <div className="h-12 bg-accent-100 rounded flex items-center justify-center text-xs">100</div>
                  <div className="h-12 bg-accent-200 rounded flex items-center justify-center text-xs">200</div>
                  <div className="h-12 bg-accent-300 rounded flex items-center justify-center text-xs">300</div>
                  <div className="h-12 bg-accent-400 rounded flex items-center justify-center text-xs text-white">400</div>
                  <div className="h-12 bg-accent-500 rounded flex items-center justify-center text-xs text-white">500</div>
                  <div className="h-12 bg-accent-600 rounded flex items-center justify-center text-xs text-white">600</div>
                  <div className="h-12 bg-accent-700 rounded flex items-center justify-center text-xs text-white">700</div>
                  <div className="h-12 bg-accent-800 rounded flex items-center justify-center text-xs text-white">800</div>
                  <div className="h-12 bg-accent-900 rounded flex items-center justify-center text-xs text-white">900</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
