

## Add Date Planning Form After "Yes" Click

This feature adds an optional "Date Planning" form that appears after someone clicks "Yes" on the Valentine site. The site creator can configure the options, and the visitor fills out their preferences.

### How It Will Work

**For the Site Creator (in the builder):**
- A toggle to enable/disable the date planning form
- A date picker to select available dates for the date
- Predefined time slot options (displayed as checkboxes to select which slots are available)
- Food preference options (checkboxes with your specified options)
- Activity options (checkboxes with your specified options)

**For the Visitor (on the live site):**
- After clicking "Yes", they see the success message
- Below that, a form appears asking for their ideal date preferences
- They select from the options the creator enabled
- After submitting, a confirmation message appears

---

### User Flow

```text
[Visitor clicks Yes]
        |
        v
[Success Screen with Form]
   - "Pick a date" (calendar date picker)
   - "Pick a time slot" (from creator's enabled slots)
   - "Food preference" (from creator's enabled options)
   - "Activity preference" (from creator's enabled options)
        |
        v
[Submit Button]
        |
        v
[Thank You / Confirmation]
```

---

### Default Options (Your Specifications)

**Time Slots:**
- 7-10 AM
- 10 AM-12 PM
- 12-2 PM
- 2-5 PM
- 5-8 PM
- 8-10 PM
- Post 10 PM

**Food Options:**
- Indian
- Asian
- North Indian
- South Indian

**Activity Options:**
- Movie night
- Dinner date
- Walk in the park
- Cozy night in
- Arcade

---

### Database Changes

**Add to `valentine_sites` table:**
- `enable_date_planning` (boolean, default false)
- `available_dates` (date array) - Specific dates the creator has available
- `time_slots` (text array) - Which time slots are enabled
- `food_options` (text array) - Which food options are enabled
- `activity_options` (text array) - Which activity options are enabled
- `success_headline` (text) - Success message headline
- `success_subtext` (text) - Success message subtext

**Create new table `date_preferences`:**
- `id` (uuid, primary key)
- `site_id` (uuid, foreign key to valentine_sites)
- `selected_date` (date) - The date they picked
- `selected_time` (text) - The time slot they picked
- `food_preference` (text) - Their food choice
- `activity_preference` (text) - Their activity choice
- `created_at` (timestamp)

With RLS policies:
- Site owners can view preferences for their sites
- Anyone can insert preferences for published sites

---

### Site Builder UI

A new collapsible "Date Planning" section with:
1. **Toggle** - Enable/disable the date planning form
2. **Date Picker** - A calendar to add available dates (can select multiple)
3. **Time Slots** - Checkboxes for each predefined slot
4. **Food Options** - Checkboxes for each predefined option
5. **Activity Options** - Checkboxes for each predefined option

---

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| Database migration | Create | Add columns to valentine_sites + create date_preferences table |
| `src/pages/CreateSite.tsx` | Modify | Add date planning configuration section |
| `src/pages/EditSite.tsx` | Modify | Add date planning configuration section |
| `src/components/DatePlanningForm.tsx` | Create | Visitor-facing form component |
| `src/components/DatePlanningConfig.tsx` | Create | Builder configuration component (reusable) |
| `src/components/templates/ClassicPreview.tsx` | Modify | Integrate form into success state |
| `src/components/templates/MemeGifPreview.tsx` | Modify | Integrate form into success state |
| `src/components/templates/TeddyBearPreview.tsx` | Modify | Integrate form into success state |
| `src/components/TemplatePreview.tsx` | Modify | Pass new config properties |
| `src/pages/ValentineSite.tsx` | Modify | Handle form submission to database |

---

### Technical Implementation

#### 1. Database Migration
Add new columns to `valentine_sites`:
- `enable_date_planning` (boolean, default false)
- `available_dates` (date[], default null)
- `time_slots` (text[], default to all slots)
- `food_options` (text[], default to all options)
- `activity_options` (text[], default to all options)
- `success_headline` (text, nullable)
- `success_subtext` (text, nullable)

Create `date_preferences` table with appropriate RLS policies.

#### 2. DatePlanningConfig Component
A reusable configuration panel for the builder with:
- Switch component to toggle feature on/off
- Multi-date picker using Shadcn Calendar
- Checkbox groups for time slots, food, and activities
- All options pre-checked by default for convenience

#### 3. DatePlanningForm Component
A visitor-facing form with:
- Calendar date picker (only showing creator's available dates)
- Radio buttons for time slot selection
- Radio buttons for food preference
- Radio buttons for activity preference
- Submit button with loading state
- Thank you confirmation after submission

#### 4. Template Integration
Each template's success state will:
- Check if `enableDatePlanning` is true
- If enabled, show `DatePlanningForm` below success message
- Pass available options to the form
- Handle the `onFormSubmit` callback

#### 5. Data Flow
```text
Creator Config → valentine_sites → ValentineSite page → Template → DatePlanningForm
                                                                          ↓
                                                                   date_preferences table
```

---

### Default State for New Sites

When a creator enables date planning, all options will be pre-selected by default:
- **Time Slots**: All 7 slots enabled
- **Food**: All 4 options enabled
- **Activities**: All 5 options enabled

This makes it easy to get started - just toggle on and add some dates!

