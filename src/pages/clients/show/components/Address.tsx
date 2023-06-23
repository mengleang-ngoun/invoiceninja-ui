/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useResolveCountry } from '$app/common/hooks/useResolveCountry';
import { Client } from '$app/common/interfaces/client';
import { InfoCard } from '$app/components/InfoCard';
import { useTranslation } from 'react-i18next';

interface Props {
  client: Client;
}

export function Address(props: Props) {
  const { t } = useTranslation();

  const resolveCountry = useResolveCountry();

  const { client } = props;

  return (
    <>
      {client && (
        <div className="col-span-12 lg:col-span-3">
          <InfoCard
            title={t('address')}
            value={
              <>
                <p>
                  {client.address1.length > 0 && client.address1}
                  {client.address1.length > 0 && <br />}  
                  {client.address2}
                </p>

                <p>
                  {client.city.length > 0 && client.city} &nbsp;
                  {client.postal_code.length > 0 && client.postal_code} &nbsp;
                  {client.state}
                </p>

                <p>{resolveCountry(client.country_id)?.name}</p>
              </>
            }
            className="h-full"
          />
        </div>
      )}
    </>
  );
}
