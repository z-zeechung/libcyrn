if(retval.data != NULL){
    for(int i=0;i<retval.count;i++){
        string *str = retval.data[i];
        if(str->data!=NULL){
            free(str->data);
        }
    }
    free(retval.data);
}