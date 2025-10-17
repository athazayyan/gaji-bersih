/**
 * Analysis Helper Functions
 *
 * Helper functions for document analysis, citation parsing, and aggregation
 */

import type {
  AnalysisIssue,
  AnalysisSummary,
  AllReferences,
  StoredRegulationReference,
  WebSearchReference,
} from './types'

/**
 * Build summary statistics from issues array
 */
export function buildSummary(issues: AnalysisIssue[]): AnalysisSummary {
  return {
    total_issues: issues.length,
    critical: issues.filter((i) => i.priority === 'critical').length,
    important: issues.filter((i) => i.priority === 'important').length,
    optional: issues.filter((i) => i.priority === 'optional').length,
  }
}

/**
 * Aggregate all references from issues
 *
 * Extracts and deduplicates stored regulations and web sources,
 * tracking which issues reference each source.
 */
export function aggregateReferences(issues: AnalysisIssue[]): AllReferences {
  const storedRegulationsMap = new Map<
    string,
    {
      id: string
      title: string
      regulation_type: string
      regulation_number: string
      category: string
      file_id: string
      used_in_issues: string[]
    }
  >()

  const webSourcesMap = new Map<
    string,
    {
      title: string
      url: string
      domain: string
      published_date?: string
      used_in_issues: string[]
    }
  >()

  // Extract references from each issue
  for (const issue of issues) {
    for (const ref of issue.references) {
      if (ref.type === 'stored_regulation') {
        const regRef = ref as StoredRegulationReference
        const key = regRef.file_id || regRef.source_id

        if (!storedRegulationsMap.has(key)) {
          // Parse regulation info from title (e.g., "UU No. 13/2003")
          const regInfo = parseRegulationInfo(regRef.title)

          storedRegulationsMap.set(key, {
            id: regRef.source_id,
            title: regRef.title,
            regulation_type: regInfo.type,
            regulation_number: regInfo.number,
            category: regInfo.category,
            file_id: regRef.file_id,
            used_in_issues: [issue.id],
          })
        } else {
          // Add issue_id to used_in_issues
          const existing = storedRegulationsMap.get(key)!
          if (!existing.used_in_issues.includes(issue.id)) {
            existing.used_in_issues.push(issue.id)
          }
        }
      } else if (ref.type === 'web_search') {
        const webRef = ref as WebSearchReference
        const key = webRef.url

        if (!webSourcesMap.has(key)) {
          webSourcesMap.set(key, {
            title: webRef.title,
            url: webRef.url,
            domain: webRef.domain,
            published_date: webRef.published_date,
            used_in_issues: [issue.id],
          })
        } else {
          // Add issue_id to used_in_issues
          const existing = webSourcesMap.get(key)!
          if (!existing.used_in_issues.includes(issue.id)) {
            existing.used_in_issues.push(issue.id)
          }
        }
      }
    }
  }

  return {
    stored_regulations: Array.from(storedRegulationsMap.values()),
    web_sources: Array.from(webSourcesMap.values()),
    total_stored_regulations: storedRegulationsMap.size,
    total_web_sources: webSourcesMap.size,
  }
}

/**
 * Parse regulation information from title
 *
 * Extracts regulation type, number, and category from title
 * Example: "UU No. 13/2003 on Labor" -> {type: "uu", number: "13/2003", category: "labor-law"}
 */
function parseRegulationInfo(title: string): {
  type: string
  number: string
  category: string
} {
  // Default values
  let type = 'other'
  let number = 'unknown'
  let category = 'general'

  // Extract regulation type (UU, PP, Permen, etc.)
  const typeMatch = title.match(/^(UU|PP|Permen|Perda|Perpres)/i)
  if (typeMatch) {
    type = typeMatch[1].toLowerCase()
  }

  // Extract regulation number (e.g., "No. 13/2003" or "13/2003")
  const numberMatch = title.match(/No\.?\s*(\d+\/\d{4})/i) || title.match(/(\d+\/\d{4})/)
  if (numberMatch) {
    number = numberMatch[1]
  }

  // Extract category from title (after "on" or "tentang")
  const categoryMatch = title.match(/(?:on|tentang)\s+(.+)/i)
  if (categoryMatch) {
    const categoryText = categoryMatch[1].toLowerCase()
    if (categoryText.includes('labor') || categoryText.includes('ketenagakerjaan')) {
      category = 'labor-law'
    } else if (categoryText.includes('wage') || categoryText.includes('upah')) {
      category = 'compensation'
    } else if (categoryText.includes('bpjs') || categoryText.includes('jaminan sosial')) {
      category = 'social-security'
    } else if (categoryText.includes('tax') || categoryText.includes('pajak')) {
      category = 'taxation'
    } else {
      category = 'general'
    }
  }

  return { type, number, category }
}

/**
 * Validate analysis result structure
 *
 * Ensures the AI response contains all required fields
 */
export function validateAnalysisResult(result: any): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!result) {
    errors.push('Result is null or undefined')
    return { valid: false, errors }
  }

  if (!Array.isArray(result.issues)) {
    errors.push('Missing or invalid "issues" array')
  } else {
    // Validate each issue
    for (let i = 0; i < result.issues.length; i++) {
      const issue = result.issues[i]
      const requiredFields = [
        'id',
        'priority',
        'category',
        'title',
        'question',
        'contract_excerpt',
        'ai_explanation',
        'references',
        'compliance_status',
        'compliance_details',
        'recommendation',
        'severity_score',
      ]

      for (const field of requiredFields) {
        if (!(field in issue)) {
          errors.push(`Issue ${i}: Missing required field "${field}"`)
        }
      }

      // Validate priority
      if (issue.priority && !['critical', 'important', 'optional'].includes(issue.priority)) {
        errors.push(`Issue ${i}: Invalid priority "${issue.priority}"`)
      }

      // Validate compliance_status
      if (
        issue.compliance_status &&
        !['compliant', 'potentially_non_compliant', 'non_compliant', 'unclear'].includes(
          issue.compliance_status
        )
      ) {
        errors.push(`Issue ${i}: Invalid compliance_status "${issue.compliance_status}"`)
      }

      // Validate severity_score
      if (
        issue.severity_score !== undefined &&
        (issue.severity_score < 0 || issue.severity_score > 1)
      ) {
        errors.push(`Issue ${i}: severity_score must be between 0 and 1`)
      }
    }
  }

  if (!Array.isArray(result.search_methods_used)) {
    errors.push('Missing or invalid "search_methods_used" array')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate salary calculation structure (for payslips)
 */
export function validateSalaryCalculation(calc: any): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!calc) {
    return { valid: true, errors: [] } // Salary calculation is optional (only for payslips)
  }

  const requiredFields = [
    'gross_salary',
    'deductions',
    'allowances',
    'total_income',
    'take_home_pay',
    'calculation_breakdown',
  ]

  for (const field of requiredFields) {
    if (!(field in calc)) {
      errors.push(`Salary calculation: Missing required field "${field}"`)
    }
  }

  // Validate deductions
  if (calc.deductions) {
    const requiredDeductions = [
      'bpjs_kesehatan',
      'bpjs_ketenagakerjaan',
      'pph21',
      'other_deductions',
      'total_deductions',
    ]
    for (const field of requiredDeductions) {
      if (!(field in calc.deductions)) {
        errors.push(`Deductions: Missing required field "${field}"`)
      }
    }
  }

  // Validate allowances
  if (calc.allowances) {
    if (!('total_allowances' in calc.allowances)) {
      errors.push(`Allowances: Missing required field "total_allowances"`)
    }
  }

  // Validate calculation_breakdown
  if (calc.calculation_breakdown) {
    if (!calc.calculation_breakdown.formula || !calc.calculation_breakdown.details) {
      errors.push(`Calculation breakdown: Missing formula or details`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
