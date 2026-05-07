export class UpdateMessages {
    static success(clientName: string, oldDate: string, newDate: string) {
        return `✅ Sua reuniáo com ${clientName} foi atualizada com sucesso de ${oldDate} para ${newDate}`;
    }
    static meetingNotFound() {
        return `⚠️ Não encontrei a reunião que você deseja atualizar. Verifique as informações e tente novamente.`;
    }
    static updateFailed() {
        return `⚠️ Ocorreu um problema ao tentar atualizar a reunião. Tente novamente mais tarde.`;
    }
}