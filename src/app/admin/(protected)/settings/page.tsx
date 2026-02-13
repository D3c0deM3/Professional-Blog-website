'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import FileUploadField from '@/components/admin/FileUploadField'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SettingItem {
  key: string
  value: string
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data: SettingItem[]) => {
        const map = data.reduce<Record<string, string>>((acc, setting) => {
          acc[setting.key] = setting.value
          return acc
        }, {})
        setSettings(map)
      })
      .catch((error) => {
        console.error('Error loading settings:', error)
        toast.error('Failed to load settings.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload = Object.entries(settings).map(([key, value]) => ({ key, value: value || '' }))
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      })

      if (response.ok) {
        toast.success('Settings updated.')
      } else {
        toast.error('Failed to update settings.')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Site Settings</h1>
        <p className="text-muted-foreground">Update global site content and hero copy.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Site Title</Label>
              <Input
                value={settings.siteTitle || ''}
                onChange={(event) => updateSetting('siteTitle', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Professor Name</Label>
              <Input
                value={settings.professorName || ''}
                onChange={(event) => updateSetting('professorName', event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Professor Title</Label>
              <Input
                value={settings.professorTitle || ''}
                onChange={(event) => updateSetting('professorTitle', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                value={settings.department || ''}
                onChange={(event) => updateSetting('department', event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>University</Label>
              <Input
                value={settings.university || ''}
                onChange={(event) => updateSetting('university', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Footer Text</Label>
              <Input
                value={settings.footerText || ''}
                onChange={(event) => updateSetting('footerText', event.target.value)}
              />
            </div>
          </div>

          <FileUploadField
            label="CV PDF"
            value={settings.cvUrl || ''}
            onChange={(value) => updateSetting('cvUrl', value)}
            accept=".pdf"
          />

          <FileUploadField
            label="Profile Image"
            value={settings.profileImageUrl || ''}
            onChange={(value) => updateSetting('profileImageUrl', value)}
            accept=".png,.jpg,.jpeg,.webp"
          />
        </TabsContent>

        <TabsContent value="hero" className="mt-6 space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="space-y-2">
            <RichTextEditor
              label="Hero Headline"
              value={settings.heroHeadline || ''}
              onChange={(value) => updateSetting('heroHeadline', value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <RichTextEditor
              label="Hero Subheadline"
              value={settings.heroSubheadline || ''}
              onChange={(value) => updateSetting('heroSubheadline', value)}
              rows={3}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary CTA Label</Label>
              <Input
                value={settings.heroPrimaryCtaLabel || ''}
                onChange={(event) => updateSetting('heroPrimaryCtaLabel', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA Link</Label>
              <Input
                value={settings.heroPrimaryCtaLink || ''}
                onChange={(event) => updateSetting('heroPrimaryCtaLink', event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Secondary CTA Label</Label>
              <Input
                value={settings.heroSecondaryCtaLabel || ''}
                onChange={(event) => updateSetting('heroSecondaryCtaLabel', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA Link</Label>
              <Input
                value={settings.heroSecondaryCtaLink || ''}
                onChange={(event) => updateSetting('heroSecondaryCtaLink', event.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6 space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Years Teaching</Label>
              <Input
                type="number"
                value={settings.yearsTeaching || ''}
                onChange={(event) => updateSetting('yearsTeaching', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Students Mentored</Label>
              <Input
                type="number"
                value={settings.studentsMentored || ''}
                onChange={(event) => updateSetting('studentsMentored', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Awards Count</Label>
              <Input
                type="number"
                value={settings.awardsCount || ''}
                onChange={(event) => updateSetting('awardsCount', event.target.value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  )
}
