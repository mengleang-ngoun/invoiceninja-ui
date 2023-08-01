/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Icon } from '$app/components/icons/Icon';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useBulkAction } from '../queries';
import { RecurringInvoice } from '$app/common/interfaces/recurring-invoice';
import { MdSync } from 'react-icons/md';
import { Modal } from '$app/components/Modal';
import { Button } from '$app/components/forms';

interface Props {
  recurringInvoices: RecurringInvoice[];
  onActionCall?: () => void;
}

export const UpdatePricesAction = (props: Props) => {
  const [t] = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOnUpdatedPrices = () => {
    setIsModalOpen(false);
  };

  const bulk = useBulkAction({ onSuccess: handleOnUpdatedPrices });

  const { recurringInvoices, onActionCall } = props;

  const getRecurringInvoicesIds = () => {
    return recurringInvoices.map(({ id }) => id);
  };

  const handleSave = () => {
    bulk(getRecurringInvoicesIds(), 'update_prices', onActionCall);
  };

  return (
    <>
      <DropdownElement
        onClick={() => setIsModalOpen(true)}
        icon={<Icon element={MdSync} />}
      >
        {t('update_prices')}
      </DropdownElement>

      <Modal
        title={t('update_prices')}
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        backgroundColor="white"
      >
        <span className="text-lg text-gray-900">{t('are_you_sure')}</span>

        <Button className="self-end" onClick={handleSave}>
          {t('yes')}
        </Button>
      </Modal>
    </>
  );
};
