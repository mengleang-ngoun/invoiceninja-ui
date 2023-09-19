/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { Divider } from '$app/components/cards/Divider';
import { CopyToClipboard } from '$app/components/CopyToClipboard';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, ClickableElement, Element } from '../../../../components/cards';
import { InputField } from '../../../../components/forms';
import { LinkToVariables } from '../common/components/LinkToVariables';
import { useAtomValue } from 'jotai';
import { companySettingsErrorsAtom } from '../../common/atoms';
import { useHandleCurrentCompanyChangeProperty } from '../../common/hooks/useHandleCurrentCompanyChange';

export function Invoices() {
  const [t] = useTranslation();

  const [pattern, setPattern] = useState<string>('');

  const companyChanges = useCompanyChanges();

  const errors = useAtomValue(companySettingsErrorsAtom);

  const handleChange = useHandleCurrentCompanyChangeProperty();

  const variables = [
    '{$counter}',
    '{$year}',
    '{$date:Y-m-d}',
    '{$user_id}',
    '{$user_custom1}',
    '{$user_custom2}',
    '{$user_custom3}',
    '{$user_custom4}',
  ];

  return (
    <Card title={t('invoices')}>
      <Element leftSide={t('number_pattern')}>
        <InputField
          value={companyChanges?.settings?.invoice_number_pattern || ''}
          onValueChange={(value) =>
            handleChange('settings.invoice_number_pattern', value)
          }
          errorMessage={errors?.errors['settings.invoice_number_pattern']}
        />
      </Element>
      <Element leftSide={t('number_counter')}>
        <InputField
          type="number"
          value={companyChanges?.settings?.invoice_number_counter || 1}
          onValueChange={(value) =>
            handleChange(
              'settings.invoice_number_counter',
              parseFloat(value) || 1
            )
          }
          errorMessage={errors?.errors['settings.invoice_number_counter']}
        />
      </Element>

      <Divider />

      {variables.map((item, index) => (
        <ClickableElement
          onClick={() => setPattern(pattern + item)}
          key={index}
        >
          <CopyToClipboard text={item} />
        </ClickableElement>
      ))}

      <Divider />

      <LinkToVariables />
    </Card>
  );
}
